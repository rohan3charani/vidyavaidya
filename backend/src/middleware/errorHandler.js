const winston = require('winston');

// Configure logger format
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // Log error using Winston
  logger.error({
    message: err.message || 'Error occurred',
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    uid: req.user ? req.user.uid : 'unauthenticated',
    ip: req.ip
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500 ? 'Internal Server Error' : message,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

module.exports = errorHandler;
