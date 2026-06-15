const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = require('../config/constants');

router.use(protect);
router.use(roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/check-duplicate', trainingController.checkDuplicate); // MUST be defined before /:id

router.route('/')
  .get(trainingController.getTrainingRecords)
  .post(trainingController.createTrainingRecord);

router.route('/:id')
  .get(trainingController.getTrainingRecordById)
  .put(trainingController.updateTrainingRecord)
  .delete(trainingController.deleteTrainingRecord);

module.exports = router;
