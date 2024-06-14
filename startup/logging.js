const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // Configure the default logger with console and file transports
  winston.configure({
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
      new winston.transports.File({ filename: "logfile.log" }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: "uncaughtExceptions.log",
        handleExceptions: true,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: "unhandledRejections.log",
        handleRejections: true,
      }),
    ],
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    throw ex;
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
  });
};
