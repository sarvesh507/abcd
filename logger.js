const winston = require("winston");
const path = require('path')

const myformat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "info",
      maxsize: 500,
    }),
  ],
});

logger.info("Information message");
logger.warn("Warning message");
logger.error("Error message");

// logger.configure({
//   level: "error",
//   transports: [new winston.transports.Console()],

//   //   level: "info",
//   //   transports: [new winston.transports.Http()],
// });

logger.log("info", "Information message");
logger.log("warn", "Warning message");
logger.error("Error message");
