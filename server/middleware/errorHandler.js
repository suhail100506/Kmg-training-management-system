const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack || err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Format standardized validation errors if present
  let errors = [];
  if (err.errors) {
    if (Array.isArray(err.errors)) {
      errors = err.errors.map(e => ({
        field: e.path || e.param || 'unknown',
        message: e.msg || e.message
      }));
    } else if (typeof err.errors === 'object') {
      errors = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      }));
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined
  });
};

module.exports = errorHandler;
