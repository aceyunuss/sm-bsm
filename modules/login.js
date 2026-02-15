const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const response = require("../utils/response");
const validate = require("../utils/validation");
const User = require("../models/User");

const check = async (req, res) => {
  dotenv.config();

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const is_un = await validate.isExist(req.body.username);
  const is_pw = await validate.isExist(req.body.password);
  if (!is_un || !is_pw) return response.badRequest("Username and password are required", res);

  // const saltRounds = 10;
  // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  try {
    const payload = { username: req.body.username };
    const col = ["user_id", "username", "password"];

    const check_un = await User.get(payload, col);

    if (!check_un.success) return response.internalServerError("Error generate token", res);
    if (check_un.count == 0) return response.notFound("User not found", res);

    const isValid = await bcrypt.compare(req.body.password, check_un.data[0].password);
    if (!isValid) return response.unauthorized("Credential not match", res);

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "2h" });

    const data = {
      user_id: check_un.data[0].user_id,
      username: check_un.data[0].username,
      type: "Bearer",
      expired: "2 hours",
      token: token,
    };

    return response.success("Success login. Token was generated", res, data);
  } catch (error) {
    return response.internalServerError("Error generate token", res);
  }
};

module.exports = { check };
