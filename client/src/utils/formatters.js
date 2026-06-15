/**
 * Formats a numeric value into Indian Standard Currency (INR, ₹).
 */
export const formatCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '\u20B9 0';
  
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(num);
  
  return `\u20B9 ${formatted}`;
};

/**
 * Formats a Date object or ISO string into DD/MM/YYYY using UTC values.
 * This ensures the calendar date remains timezone-independent.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Converts a Date into YYYY-MM-DD for standard calendar HTML input forms.
 * Uses local date methods to format local Date objects (e.g. from DatePickers).
 */
export const formatInputDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

/**
 * Converts a UTC midnight Date/string from backend to a local midnight Date object.
 * This prevents react-datepicker from shifting dates due to client timezone offsets.
 */
export const utcToLocalMidnight = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0);
};

