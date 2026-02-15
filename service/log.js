const winston = require("winston");
const morgan = require("morgan");
const moment = require("moment-timezone");  // Pastikan install moment-timezone
const path = require("path");
const { combine, timestamp, prettyPrint } = winston.format;
const fsr = require("file-stream-rotator");

// ✅ IMPORT yang benar untuk DailyRotateFile
const DailyRotateFile = require("winston-daily-rotate-file");

const log_dir = (fname) => {
  return path.join(__dirname.replace("service", "logs"), fname);
};

const timezoned = () => {
  return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
};

const morg = () => {
  morgan.token("date", timezoned);

  let accessLogStream = {};
  const ac_path = log_dir("");

  accessLogStream = fsr.getStream({
    filename: `${ac_path}/%DATE%[access].log`,
    frequency: "daily",
    verbose: true,
    date_format: "YYYYMMDD",
  });

  return {
    format:
      ':remote-addr | :remote-user | :date[Asia/Jakarta] | :method | ":url" | :status | :response-time ms | HTTP/:http-version | :res[content-length] | ":user-agent"',
    logstream: accessLogStream,
  };
};

// ✅ Gunakan DailyRotateFile yang sudah di-require
const errorLogger = winston.createLogger({
  format: combine(timestamp({ format: timezoned }), prettyPrint()),
  transports: [
    new DailyRotateFile({
      filename: log_dir("%DATE%[error].log"),
      datePattern: "YYYYMMDD",
      maxSize: "20m",
      maxFiles: "30d"
    }),
  ],
});

const infoLogger = winston.createLogger({
  format: combine(timestamp({ format: timezoned }), prettyPrint()),
  transports: [
    new DailyRotateFile({
      filename: log_dir("%DATE%[info].log"),
      datePattern: "YYYYMMDD",
      maxSize: "20m",
      maxFiles: "30d"
    }),
  ],
});

const cronLogger = winston.createLogger({
  format: combine(timestamp({ format: timezoned }), prettyPrint()),
  transports: [
    new DailyRotateFile({
      filename: log_dir("%DATE%[cron].log"),
      datePattern: "YYYYMMDD",
      maxSize: "20m",
      maxFiles: "30d"
    }),
  ],
});

const wins = {
  info: (params) => {
    return infoLogger.info(params);
  },
  error: (params) => {
    return errorLogger.error(params);
  },
  cron: (params) => {
    return cronLogger.info(params);
  },
};

module.exports = { morg, wins };