const moment = require('moment');

/**
 * Calculates the Indian Financial Year string for a given date.
 * E.g., 2026-06-09 -> "FY 2026-27"
 */
const getIndianFY = (dateInput) => {
  if (!dateInput) return '';
  const date = moment(dateInput);
  const month = date.month(); // 0-indexed, Jan = 0, Apr = 3
  const year = date.year();
  if (month >= 3) {
    return `FY ${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `FY ${year - 1}-${String(year).slice(-2)}`;
  }
};

/**
 * Calculates the Indian Financial Quarter for a given date.
 * Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar
 */
const getIndianQuarter = (dateInput) => {
  if (!dateInput) return '';
  const date = moment(dateInput);
  const month = date.month(); // 0-indexed
  if (month >= 3 && month <= 5) return 'Q1';
  if (month >= 6 && month <= 8) return 'Q2';
  if (month >= 9 && month <= 11) return 'Q3';
  return 'Q4';
};

/**
 * Returns the start date of a given Indian FY (April 1st UTC).
 * Input format: "FY 2025-26"
 */
const startOfFY = (fyString) => {
  const match = fyString.match(/FY (\d{4})-\d{2}/);
  if (match) {
    return moment.utc(`${match[1]}-04-01T00:00:00.000Z`).toDate();
  }
  return null;
};

/**
 * Returns the end date of a given Indian FY (March 31st 23:59:59 UTC).
 * Input format: "FY 2025-26"
 */
const endOfFY = (fyString) => {
  const match = fyString.match(/FY (\d{4})-\d{2}/);
  if (match) {
    const startYear = parseInt(match[1], 10);
    return moment.utc(`${startYear + 1}-03-31T23:59:59.999Z`).toDate();
  }
  return null;
};

module.exports = {
  getIndianFY,
  getIndianQuarter,
  startOfFY,
  endOfFY
};
