const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/search', roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN), staffController.searchStaff); // MUST be defined before /:id

router.route('/')
  .get(roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN), staffController.getStaff)
  .post(roleCheck(ROLES.SUPER_ADMIN), staffController.createStaff);

router.route('/:id')
  .get(roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN), staffController.getStaffById)
  .put(roleCheck(ROLES.SUPER_ADMIN), staffController.updateStaff)
  .delete(roleCheck(ROLES.SUPER_ADMIN), staffController.deleteStaff);

module.exports = router;
