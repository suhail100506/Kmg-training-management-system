const MasterData = require('../models/MasterData');

/**
 * Ensures that a dynamic master value is registered in MasterData collection if it doesn't already exist.
 * Uses a case-insensitive match to prevent duplicate entries (e.g., "Engineering" and "engineering").
 * @param {string} type - Master data type (e.g. 'designation', 'groupName', 'productDivision')
 * @param {string} value - The text value to ensure exists
 */
const ensureMasterDataExists = async (type, value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '-') return false;

  try {
    // Escape special regex characters to prevent pattern matching issues
    const escapedValue = trimmed.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const exists = await MasterData.findOne({
      type,
      value: { $regex: `^${escapedValue}$`, $options: 'i' }
    });

    if (!exists) {
      await MasterData.create({
        type,
        value: trimmed,
        isActive: true
      });
      console.log(`Auto-registered new master data option: [${type}] "${trimmed}"`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error in ensureMasterDataExists for [${type}] "${value}":`, err);
    return false;
  }
};

/**
 * Syncs multiple fields from a staff record or raw object
 * @param {object} staffObj 
 */
const syncStaffMasterFields = async (staffObj) => {
  if (!staffObj) return;
  const promises = [];
  if (staffObj.designation) {
    promises.push(ensureMasterDataExists('designation', staffObj.designation));
  }
  if (staffObj.groupName) {
    promises.push(ensureMasterDataExists('groupName', staffObj.groupName));
  }
  if (staffObj.productDivisionCategory) {
    promises.push(ensureMasterDataExists('productDivision', staffObj.productDivisionCategory));
  }
  await Promise.all(promises);
};

module.exports = {
  ensureMasterDataExists,
  syncStaffMasterFields
};
