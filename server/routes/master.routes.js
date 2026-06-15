const express = require('express');
const router = express.Router();
const masterController = require('../controllers/master.controller');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = require('../config/constants');

router.use(protect);

// Reading master data values is allowed for both roles to populate form selects
router.get('/:type', roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN), masterController.getMasterData);

// Creation, update, and deletion are restricted to Super Admin only
router.use(roleCheck(ROLES.SUPER_ADMIN));

router.post('/:type', masterController.addMasterValue);
router.put('/:type/:id', masterController.updateMasterValue);
router.delete('/:type/:id', masterController.deleteMasterValue);

module.exports = router;
