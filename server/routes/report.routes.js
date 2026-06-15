const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = require('../config/constants');

router.use(protect);
router.use(roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/monthly', reportController.getMonthlyReport);
router.get('/quarterly', reportController.getQuarterlyReport);
router.get('/financial-year', reportController.getFinancialYearReport);
router.get('/staff-wise', reportController.getStaffWiseReport);
router.get('/department-wise', reportController.getDepartmentWiseReport);
router.get('/cost-analysis', reportController.getCostAnalysisReport);
router.get('/training-status', reportController.getTrainingStatusReport);
router.get('/beneficiaries', reportController.getBeneficiaryReport);

router.post('/export', reportController.exportReport);

module.exports = router;
