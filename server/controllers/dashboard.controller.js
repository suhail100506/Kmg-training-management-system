const TrainingRecord = require('../models/TrainingRecord');
const Staff = require('../models/Staff');
const { startOfFY, endOfFY } = require('../utils/dateHelpers');
const { sendSuccess } = require('../utils/response');

// Helper to build match filter from request query
const getMatchQuery = (query) => {
  const { financialYear, startDate, endDate, group, division } = query;
  const match = { isDeleted: false };

  if (group) {
    match.groupName = group;
  }
  if (division) {
    match.productDivisionCategory = division;
  }

  let start = null;
  let end = null;

  if (financialYear) {
    start = startOfFY(financialYear);
    end = endOfFY(financialYear);
  }

  if (startDate || endDate) {
    if (startDate) {
      const dStart = new Date(startDate);
      start = start ? (dStart > start ? dStart : start) : dStart;
    }
    if (endDate) {
      const dEnd = new Date(endDate);
      end = end ? (dEnd < end ? dEnd : end) : dEnd;
    }
  }

  if (start || end) {
    match.startDateOfTraining = {};
    if (start) match.startDateOfTraining.$gte = start;
    if (end) match.startDateOfTraining.$lte = end;
  }

  return match;
};

// @desc    Get dashboard KPI Summary Cards
// @route   GET /api/v1/dashboard/summary
// @access  Private (Admin + Super Admin)
const getSummary = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    // 1. Core KPIs from trainingRecords
    const recordKPIs = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalHours: { $sum: '$trainingDurationHours' },
          totalCost: { $sum: '$trainingCostPerPerson' },
          uniqueStaffList: { $addToSet: '$staffNumber' },
          totalBeneficiaries: {
            $sum: {
              $cond: [{ $eq: ['$trainingStatus', 'Completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const kpi = recordKPIs[0] || {
      totalRecords: 0,
      totalHours: 0,
      totalCost: 0,
      uniqueStaffList: [],
      totalBeneficiaries: 0
    };

    const uniqueStaffTrainedCount = kpi.uniqueStaffList.length;

    // 2. Count total active staff (with group/division filters applied)
    const staffQuery = { isDeleted: false, employmentStatus: 'Currently Serving' };
    if (req.query.group) {
      staffQuery.groupName = req.query.group;
    }
    if (req.query.division) {
      staffQuery.productDivisionCategory = req.query.division;
    }
    const totalActiveStaff = await Staff.countDocuments(staffQuery);

    const coveragePercent = totalActiveStaff > 0
      ? Math.round((uniqueStaffTrainedCount / totalActiveStaff) * 1000) / 10
      : 0;

    return sendSuccess(res, 'KPI Summary fetched successfully', {
      totalRecords: kpi.totalRecords,
      uniqueStaffTrained: uniqueStaffTrainedCount,
      totalTrainingHours: kpi.totalHours,
      totalTrainingCost: kpi.totalCost,
      trainingCoveragePercent: coveragePercent,
      totalBeneficiaries: kpi.totalBeneficiaries,
      totalActiveStaff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get training counts and hours by month
// @route   GET /api/v1/dashboard/by-month
// @access  Private (Admin + Super Admin)
const getByMonth = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    const data = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $month: '$startDateOfTraining' },
          count: { $sum: 1 },
          hours: { $sum: '$trainingDurationHours' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format output with month names (April to March if FY selected, or Jan-Dec default)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const result = monthNames.map((name, index) => {
      const matchMonth = data.find(item => item._id === index + 1);
      return {
        month: name,
        monthIndex: index + 1,
        count: matchMonth ? matchMonth.count : 0,
        hours: matchMonth ? matchMonth.hours : 0
      };
    });

    // If FY toggle is standard, sort to represent April -> March
    const { financialYear } = req.query;
    if (financialYear) {
      // April (index 3) is 0, May is 1 ... March (index 2) is 11
      result.sort((a, b) => {
        const orderA = a.monthIndex >= 4 ? a.monthIndex - 4 : a.monthIndex + 8;
        const orderB = b.monthIndex >= 4 ? b.monthIndex - 4 : b.monthIndex + 8;
        return orderA - orderB;
      });
    }

    return sendSuccess(res, 'Monthly comparison fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get count by training status
// @route   GET /api/v1/dashboard/by-status
// @access  Private (Admin + Super Admin)
const getByStatus = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    const data = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$trainingStatus',
          value: { $sum: 1 }
        }
      }
    ]);

    const result = data.map(item => ({
      name: item._id,
      value: item.value
    }));

    return sendSuccess(res, 'Status distribution fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get count by training type
// @route   GET /api/v1/dashboard/by-type
// @access  Private (Admin + Super Admin)
const getByType = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    const data = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$typeOfTraining',
          value: { $sum: 1 }
        }
      }
    ]);

    const result = data.map(item => ({
      name: item._id,
      value: item.value
    }));

    return sendSuccess(res, 'Training type distribution fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get count by training mode
// @route   GET /api/v1/dashboard/by-mode
// @access  Private (Admin + Super Admin)
const getByMode = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    const data = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$trainingMode',
          value: { $sum: 1 }
        }
      }
    ]);

    const result = data.map(item => ({
      name: item._id,
      value: item.value
    }));

    return sendSuccess(res, 'Training mode distribution fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Top 10 training topics by attendance
// @route   GET /api/v1/dashboard/top-trainings
// @access  Private (Admin + Super Admin)
const getTopTrainings = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    const data = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$trainingTopic',
          attendance: { $sum: 1 }
        }
      },
      { $sort: { attendance: -1 } },
      { $limit: 10 }
    ]);

    const result = data.map(item => ({
      topic: item._id,
      attendance: item.attendance
    }));

    return sendSuccess(res, 'Top topics fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Cost breakdown by training type
// @route   GET /api/v1/dashboard/cost-by-type
// @access  Private (Admin + Super Admin)
const getCostByType = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    const data = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$typeOfTraining',
          cost: { $sum: '$trainingCostPerPerson' }
        }
      }
    ]);

    const result = data.map(item => ({
      name: item._id,
      cost: item.cost
    }));

    return sendSuccess(res, 'Cost analysis by type fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get training coverage % by Group Name
// @route   GET /api/v1/dashboard/coverage-by-group
// @access  Private (Admin + Super Admin)
const getCoverageByGroup = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    // 1. Get unique staff trained per group
    const trainedData = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$groupName',
          trainedStaff: { $addToSet: '$staffNumber' }
        }
      }
    ]);

    // 2. Get active staff count per group
    const staffData = await Staff.aggregate([
      { $match: { isDeleted: false, employmentStatus: 'Currently Serving' } },
      {
        $group: {
          _id: '$groupName',
          totalStaff: { $sum: 1 }
        }
      }
    ]);

    const result = staffData.map(groupInfo => {
      const gName = groupInfo._id || 'Unknown';
      const trainedGroup = trainedData.find(item => item._id === groupInfo._id);
      const trainedCount = trainedGroup ? trainedGroup.trainedStaff.length : 0;
      const totalCount = groupInfo.totalStaff;

      return {
        groupName: gName,
        totalStaff: totalCount,
        trainedStaff: trainedCount,
        coveragePercent: totalCount > 0 ? Math.round((trainedCount / totalCount) * 100) : 0
      };
    });

    return sendSuccess(res, 'Coverage by group fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get training coverage % by Product Division
// @route   GET /api/v1/dashboard/coverage-by-division
// @access  Private (Admin + Super Admin)
const getCoverageByDivision = async (req, res, next) => {
  try {
    const match = getMatchQuery(req.query);

    // 1. Get unique staff trained per division
    const trainedData = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$productDivisionCategory',
          trainedStaff: { $addToSet: '$staffNumber' }
        }
      }
    ]);

    // 2. Get active staff count per division
    const staffData = await Staff.aggregate([
      { $match: { isDeleted: false, employmentStatus: 'Currently Serving' } },
      {
        $group: {
          _id: '$productDivisionCategory',
          totalStaff: { $sum: 1 }
        }
      }
    ]);

    const result = staffData.map(divInfo => {
      const dName = divInfo._id || 'Unknown';
      const trainedDiv = trainedData.find(item => item._id === divInfo._id);
      const trainedCount = trainedDiv ? trainedDiv.trainedStaff.length : 0;
      const totalCount = divInfo.totalStaff;

      return {
        divisionName: dName,
        totalStaff: totalCount,
        trainedStaff: trainedCount,
        coveragePercent: totalCount > 0 ? Math.round((trainedCount / totalCount) * 100) : 0
      };
    });

    return sendSuccess(res, 'Coverage by division fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getByMonth,
  getByStatus,
  getByType,
  getByMode,
  getTopTrainings,
  getCostByType,
  getCoverageByGroup,
  getCoverageByDivision
};
