const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  new winston.Logger({
    transports: [
      new winston.transports.Console({ colorize: true, prettyPrint: true }),
      new winston.transports.File({
        handleExceptions: true,
        handleRejections: true,
        filename: "uncaughtExceptions.log",
      }),
    ],
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.configure({
    transports: [
      new winston.transports.File({ filename: "logfile.log" }),
      new winston.transports.MongoDB({ db: config.get("db"), level: "info" }),
    ],
  });
};
