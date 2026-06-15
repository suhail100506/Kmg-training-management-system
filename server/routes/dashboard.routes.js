const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = require('../config/constants');

router.use(protect);
router.use(roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/summary', dashboardController.getSummary);
router.get('/by-month', dashboardController.getByMonth);
router.get('/by-status', dashboardController.getByStatus);
router.get('/by-type', dashboardController.getByType);
router.get('/by-mode', dashboardController.getByMode);
router.get('/top-trainings', dashboardController.getTopTrainings);
router.get('/cost-by-type', dashboardController.getCostByType);
router.get('/coverage-by-group', dashboardController.getCoverageByGroup);
router.get('/coverage-by-division', dashboardController.getCoverageByDivision);

module.exports = router;
