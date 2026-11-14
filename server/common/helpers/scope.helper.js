//===========================================================================================
//    DATA SCOPE HELPER (ROW-LEVEL PERMISSION FILTERING)
//    Applies database-level query scoping based on the authenticated user's role:
//    - SUPER_ADMIN: Unrestricted access across the organization
//    - SALES_MANAGER: Scoped to manager and their reporting subordinates
//    - BDE: Strictly scoped to their own assigned records
//===========================================================================================

const { Op } = require('sequelize');

/**
 * Builds Sequelize WHERE condition for row-level owner scoping
 * @param {Object} user - Decoded JWT user object from req.user
 * @param {string} ownerField - Name of the owner foreign key column (e.g. 'owner_id')
 * @returns {Object} Sequelize where filter
 */
const buildRowScope = (user, ownerField = 'owner_id') => {
  // If no user context provided or user is SUPER_ADMIN, no restrictions
  if (!user || user.roleCode === 'SUPER_ADMIN') {
    return {};
  }

  // SALES_MANAGER: Can view their own records + records of all direct/indirect reporting staff
  if (user.roleCode === 'SALES_MANAGER') {
    const managerTeamIds = [Number(user.staffId), ...(user.subordinateIds || []).map(Number)];
    return {
      [ownerField]: {
        [Op.in]: managerTeamIds,
      },
    };
  }

  // BDE (or any standard individual contributor): Strictly their own records
  return {
    [ownerField]: Number(user.staffId),
  };
};

/**
 * Validates if the authenticated user has permission to read or modify a specific record
 * @param {Object} user - Decoded JWT user object from req.user
 * @param {Object} record - Database record or shaped object containing ownerId / owner_id
 * @param {string} ownerField - Name of the owner field on the record
 * @returns {boolean}
 */
const canAccessRecord = (user, record, ownerField = 'owner_id') => {
  if (!user || user.roleCode === 'SUPER_ADMIN') return true;
  if (!record) return false;

  const recordOwnerId = Number(record[ownerField] || record.ownerId || record.owner_id);

  if (user.roleCode === 'SALES_MANAGER') {
    const managerTeamIds = [Number(user.staffId), ...(user.subordinateIds || []).map(Number)];
    return managerTeamIds.includes(recordOwnerId);
  }

  // BDE
  return recordOwnerId === Number(user.staffId);
};

module.exports = {
  buildRowScope,
  canAccessRecord,
};

