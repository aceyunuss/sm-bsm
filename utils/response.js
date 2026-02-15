const { wins } = require("../service/log");

const success = (msg, res, data = {}, attr = {}) => {
  wins.info(data);
  res.status(200).json({
    status: "success",
    status_code: 200,
    message: msg,
    count_data: data.length,
    ...attr,
    data: data,
  });
};

const created = (msg, res, data = {}, attr = {}) => {
  wins.info(data);
  res.status(201).json({
    status: "success",
    status_code: 201,
    message: msg,
    count_data: data.length,
    ...attr,
    data: data,
  });
};

const badRequest = (msg, res) => {
  res.status(400).json({
    status: "failed",
    status_code: 400,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const forbidden = (msg, res) => {
  res.status(403).json({
    status: "failed",
    status_code: 403,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const notFound = (msg, res) => {
  res.status(404).json({
    status: "failed",
    status_code: 404,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const conflict = (msg, res) => {
  res.status(409).json({
    status: "failed",
    status_code: 409,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const internalServerError = (msg, res) => {
  res.status(500).json({
    status: "failed",
    status_code: 500,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const serviceUnavailable = (msg, res) => {
  res.status(503).json({
    status: "failed",
    status_code: 503,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const gatewayTimeout = (msg, res) => {
  res.status(504).json({
    status: "failed",
    status_code: 504,
    message: msg,
    count_data: 0,
    data: [],
  });
};

const unauthorized = (msg, res) => {
  res.status(401).json({
    status: "failed",
    status_code: 401,
    message: msg,
    count_data: 0,
    data: [],
  });
};
module.exports = {
  gatewayTimeout,
  internalServerError,
  notFound,
  forbidden,
  badRequest,
  success,
  created,
  conflict,
  unauthorized,
  serviceUnavailable,
};
