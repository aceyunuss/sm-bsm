const moment = require("moment");
const timezone = "Asia/Jakarta";

const getDate = () => {
  return moment().tz(timezone).format("YYYY-MM-DD");
};

const getDateNospace = () => {
  return moment().tz(timezone).format("YYYYMMDDHHmmss");
};

const getDateTime = () => {
  return moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
};

const getDateTimezone = () => {
  return moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss.SSSSSS ZZ");
};

const convert = (dt) => {
  return moment(dt).tz(timezone).format("YYYY-MM-DD HH:mm:ss.SSSSSS ZZ");
};

module.exports = { getDateNospace, getDate, getDateTime, getDateTimezone, convert };
