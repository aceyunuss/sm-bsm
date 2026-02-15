const jwt = require("jsonwebtoken");
const response = require("../utils/response");
const { wins } = require("../service/log");
const validate = require("../utils/validation");
const config = process.env;

const auth = (req, res, next) => {
  wins.info({ endpoint: req.baseUrl, header: req.headers, body: req.body, param: req.params, query: req.query });

  const token = req.headers.authorization;
  if (!token) return response.forbidden("A token is required for authentication", res);

  try {
    req.user = jwt.verify(token.split(" ")[1], config.JWT_KEY);
    return next();
  } catch (err) {
    return response.forbidden("Invalid Token", res);
  }
};


module.exports = { auth };
