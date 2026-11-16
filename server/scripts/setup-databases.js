'use strict';

//===========================================================================================
//    DATABASE PROVISIONING, MIGRATION & SEEDER RUNNER
//===========================================================================================

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

// 2 Separate Databases: 'g-axis-main' (Super Admin Control Plane) and 'org_gitakshmi' (Tenant DB)
const GAXIS_DB_NAME = 'g-axis-main';
const ORG_DB_NAME = 'org_gitakshmi';

/**
 * Run migrations from a directory against a Sequelize instance
 */
async function runMigrations(sequelize, migrationsDir) {
  const queryInterface = sequelize.getQueryInterface();
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();

  for (const file of files) {
    console.log(`  -> Applying migration: ${file}`);
    const migration = require(path.join(migrationsDir, file));
    await migration.up(queryInterface, Sequelize);
  }
}

/**
 * Run seeders from a directory against a Sequelize instance
 */
async function runSeeders(sequelize, seedersDir) {
  const queryInterface = sequelize.getQueryInterface();
  const files = fs.readdirSync(seedersDir).filter(f => f.endsWith('.js')).sort();

  for (const file of files) {
    console.log(`  -> Applying seeder: ${file}`);
    const seeder = require(path.join(seedersDir, file));
    await seeder.up(queryInterface, Sequelize);
  }
}

async function main() {
  console.log('===========================================================================================');
  console.log('   STARTING G-AXIS ERP MULTI-TENANT DATABASE PROVISIONING');
  console.log('===========================================================================================');

  // Step 1: Connect to MySQL root and drop old/legacy databases
  console.log('\n[1/5] Connecting to MySQL server and dropping old databases...');
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD
  });

  // Drop old databases completely
  console.log('  -> Dropping legacy `g_crm`...');
  await conn.query('DROP DATABASE IF EXISTS `g_crm`;');

  console.log('  -> Dropping old `g_axis_main`...');
  await conn.query('DROP DATABASE IF EXISTS `g_axis_main`;');

  console.log('  -> Dropping `g-axis-main`...');
  await conn.query(`DROP DATABASE IF EXISTS \`${GAXIS_DB_NAME}\`;`);

  console.log('  -> Dropping `org_gitakshmi`...');
  await conn.query(`DROP DATABASE IF EXISTS \`${ORG_DB_NAME}\`;`);

  // Create fresh databases
  console.log(`  -> Creating fresh \`${GAXIS_DB_NAME}\`...`);
  await conn.query(`CREATE DATABASE \`${GAXIS_DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

  console.log(`  -> Creating fresh \`${ORG_DB_NAME}\`...`);
  await conn.query(`CREATE DATABASE \`${ORG_DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

  console.log('  [OK] Clean databases created.');
  await conn.end();

  // Step 2: Connect to g-axis-main and run migrations
  console.log(`\n[2/5] Migrating '${GAXIS_DB_NAME}' (Super Admin Control Plane)...`);
  const gaxisSequelize = new Sequelize(GAXIS_DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false
  });
  await gaxisSequelize.authenticate();

  const gaxisMigrationsDir = path.resolve(__dirname, '../database/migrations/gaxis');
  await runMigrations(gaxisSequelize, gaxisMigrationsDir);

  // Step 3: Seed g-axis-main
  console.log(`\n[3/5] Seeding '${GAXIS_DB_NAME}' (Super Admin, Products, Lookups, Org Map)...`);
  const gaxisSeedersDir = path.resolve(__dirname, '../database/seeders/gaxis');
  await runSeeders(gaxisSequelize, gaxisSeedersDir);

  // Step 4: Connect to org_gitakshmi and run migrations
  console.log(`\n[4/5] Migrating '${ORG_DB_NAME}' (Tenant DB: Core + CRM)...`);
  const orgSequelize = new Sequelize(ORG_DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false
  });
  await orgSequelize.authenticate();

  const orgMigrationsDir = path.resolve(__dirname, '../database/migrations/org');
  await runMigrations(orgSequelize, orgMigrationsDir);

  // Step 5: Seed org_gitakshmi
  console.log(`\n[5/5] Seeding '${ORG_DB_NAME}' (Settings, Roles, Users, Initial CRM Leads)...`);
  const orgSeedersDir = path.resolve(__dirname, '../database/seeders/org');
  await runSeeders(orgSequelize, orgSeedersDir);

  // Verification & Table Summaries
  console.log('\n===========================================================================================');
  console.log('   VERIFYING DATABASE TABLES & RECORD COUNTS');
  console.log('===========================================================================================');

  // Verify g-axis-main tables
  const [gaxisTables] = await gaxisSequelize.query(`SHOW TABLES IN \`${GAXIS_DB_NAME}\`;`);
  console.log(`\n[Database: ${GAXIS_DB_NAME}] Total Tables: ${gaxisTables.length}`);
  const gaxisTableList = gaxisTables.map(t => Object.values(t)[0]);
  for (const table of gaxisTableList) {
    const [[countResult]] = await gaxisSequelize.query(`SELECT COUNT(*) AS total FROM \`${table}\`;`);
    console.log(`  - ${table.padEnd(32)}: ${countResult.total} row(s)`);
  }

  // Verify org_gitakshmi tables
  const [orgTables] = await orgSequelize.query(`SHOW TABLES IN \`${ORG_DB_NAME}\`;`);
  console.log(`\n[Database: ${ORG_DB_NAME}] Total Tables: ${orgTables.length}`);
  const orgTableList = orgTables.map(t => Object.values(t)[0]);
  for (const table of orgTableList) {
    const [[countResult]] = await orgSequelize.query(`SELECT COUNT(*) AS total FROM \`${table}\`;`);
    console.log(`  - ${table.padEnd(32)}: ${countResult.total} row(s)`);
  }

  await gaxisSequelize.close();
  await orgSequelize.close();

  console.log('\n===========================================================================================');
  console.log('   ALL MULTI-TENANT MIGRATIONS & SEEDERS COMPLETED SUCCESSFULLY!');
  console.log('===========================================================================================');
}

main().catch(err => {
  console.error('\nERROR during setup:', err);
  process.exit(1);
});
