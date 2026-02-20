const bcrypt = require("bcrypt");
const response = require("../utils/response");
const validate = require("../utils/validation");
const User = require("../models/User");
const { Op } = require("sequelize");

const getUser = async (req, res) => {
  const is_user_id = await validate.isExist(req.params.user_id);
  if (!is_user_id) return response.badRequest("User id is required", res);

  try {

    const check_un = await User.get({ user_id: req.params.user_id });

    if (!check_un.success) return response.internalServerError("Error get user", res);

    if (check_un.count == 0) return response.notFound("User not found", res);

    return response.success("Success get user", res, check_un.data[0]);
  } catch (error) {
    return response.internalServerError("Error get user", res);
  }
};

const getAllUser = async (req, res) => {
  try {
    const check_un = await User.get({});

    if (!check_un.success) return response.internalServerError("Error get user", res);

    if (check_un.count == 0) return response.notFound("User not found", res);

    return response.success("Success get user", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get user", res);
  }
};

const insertUser = async (req, res) => {
  const required = ["name", "username", "email", "nip", "password", "role_id", "created_by", "tenant_id", "sub_tenant_id"];

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(required, req.body);
  if (miss) return response.badRequest(miss, res);

  try {
    const pw = await bcrypt.hash(req.body.password, 10);

    const data = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      nip: req.body.nip,
      password: pw,
      role_id: req.body.role_id,
      tenant_id: req.body.tenant_id,
      sub_tenant_id: req.body.sub_tenant_id,
      created_by: req.body.created_by,
      created_date: new Date().toISOString(),
    };

    const check_un = await User.get({ username: req.body.username }, ["user_id"]);
    if (!check_un.success) return response.internalServerError("Error check user", res);
    if (check_un.count > 0) return response.conflict("Username already exist", res);

    const ins = await User.ins(data);
    if (ins.success) return response.created("Success insert user", res, { user_id: ins.data });

    return response.serviceUnavailable("Error transaction insert user", res);
  } catch (error) {
    return response.internalServerError("Error insert user", res);
  }
};

const updateUser = async (req, res) => {
  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  try {
    const data = {
      updated_date: new Date(),
      updated_by: req.body.updated_by,
    };

    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.email !== undefined) data.email = req.body.email;
    if (req.body.dob !== undefined) data.dob = req.body.dob;
    if (req.body.nip !== undefined) data.nip = req.body.nip;
    if (req.body.role_id !== undefined) data.role_id = req.body.role_id;
    if (req.body.tenant_id !== undefined) data.tenant_id = req.body.tenant_id;
    if (req.body.sub_tenant_id !== undefined) data.sub_tenant_id = req.body.sub_tenant_id;
    if (req.body.password !== undefined) {
      const pw = await bcrypt.hash(req.body.password, 10);
      data.password = pw;
    }

    if (req.body.username !== undefined) {
      data.username = req.body.username;

      const check_un = await User.get({ username: req.body.username, user_id: { [Op.ne]: req.params.user_id } }, [
        "user_id",
      ]);
      if (!check_un.success) return response.internalServerError("Error check user", res);
      if (check_un.count > 0) return response.conflict("Username already exist", res);
    }

    const upd = await User.upd(data, { user_id: req.params.user_id });

    if (upd.success) return response.success("Success update user", res, { user_id: req.params.user_id });

    return response.serviceUnavailable("Error transaction update user", res);
  } catch (error) {
    return response.internalServerError("Error update user", res);
  }
};

module.exports = { getUser, getAllUser, insertUser, updateUser };
