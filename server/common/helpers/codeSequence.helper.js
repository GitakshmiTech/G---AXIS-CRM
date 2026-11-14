//    CODE SEQUENCE GENERATOR HELPER
//    Generates monotonic, collision-free codes (e.g., LD-000001, ACC-000001, DL-000001)

const { sequelize } = require('../../database/connection');

/**
 * Generate next formatted entity code atomically using row locking
 * @param {string} prefix - Entity prefix code (e.g. 'LD-', 'ACC-', 'CNT-', 'DL-')
 * @param {object} [transaction] - Optional Sequelize transaction instance
 * @returns {Promise<string>} Next formatted sequence code
 */
const getNextCode = async (prefix, transaction = null) => {
  const queryOptions = transaction ? { transaction, lock: transaction.LOCK.UPDATE } : {};

  // Atomic SELECT ... FOR UPDATE or raw increment
  const [rows] = await sequelize.query(
    'SELECT prefix, next_value, pad_length FROM code_sequences WHERE prefix = :prefix FOR UPDATE',
    {
      replacements: { prefix },
      type: sequelize.QueryTypes.SELECT,
      ...queryOptions,
    }
  );

  let nextVal = 1;
  let padLen = 6;

  if (rows) {
    nextVal = Number(rows.next_value);
    padLen = Number(rows.pad_length) || 6;

    // Increment counter
    await sequelize.query(
      'UPDATE code_sequences SET next_value = next_value + 1 WHERE prefix = :prefix',
      {
        replacements: { prefix },
        type: sequelize.QueryTypes.UPDATE,
        ...queryOptions,
      }
    );
  } else {
    // Insert initial sequence if not found
    await sequelize.query(
      'INSERT INTO code_sequences (prefix, next_value, pad_length) VALUES (:prefix, 2, :pad_length)',
      {
        replacements: { prefix, pad_length: padLen },
        type: sequelize.QueryTypes.INSERT,
        ...queryOptions,
      }
    );
  }

  const paddedNumber = String(nextVal).padStart(padLen, '0');
  return `${prefix}${paddedNumber}`;
};

module.exports = {
  getNextCode,
};
