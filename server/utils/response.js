/**
 * Sends a standardized success response.
 */
const sendSuccess = (res, message, data = {}, pagination = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination && { pagination })
  });
};

/**
 * Sends a standardized error response.
 */
const sendError = (res, message, errors = [], statusCode = 400) => {
  const formattedErrors = Array.isArray(errors) ? errors : [{ message: String(errors) }];
  return res.status(statusCode).json({
    success: false,
    message,
    errors: formattedErrors
  });
};

module.exports = { sendSuccess, sendError };
