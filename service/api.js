const { wins } = require("./log");
const axios = require("axios");

const post = async (param) => {
  try {
    const response = await axios.post(param.url, param.body, { headers: param.head });
    return { isok: true, code: response.status, data: response.data };
  } catch (err) {
    wins.error(err);
    return { isok: false, code: err.response.status, data: err.response.data };
  }
};

const get = async (url, headers = {}) => {
  try {
    const response = await axios.get(url, { headers });
    return { isok: true, code: response.status, data: response.data };
  } catch (err) {
    wins.error(err);
    return { isok: false, code: err.response.status, data: err.response.data };
  }
};

module.exports = { post, get };
