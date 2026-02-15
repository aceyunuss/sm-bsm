const response = require("../utils/response");
const validate = require("../utils/validation");
const Role = require("../models/Role");
const { Op } = require("sequelize");

const getRole = async (req, res) => {

  const is_role_id = await validate.isExist(req.params.role_id);
  if (!is_role_id) return response.badRequest("Role ID is required", res);

  try {
    const col = ["role_id", "name", "level"];

    const check_un = await Role.get({ role_id: req.params.role_id }, col);

    if (!check_un.success) return response.internalServerError("Error get role", res);

    if (check_un.count == 0) return response.notFound("Role not found", res);

    return response.success("Success get role", res, check_un.data[0]);
  } catch (error) {
    return response.internalServerError("Error get role", res);
  }
};

const getAllRole = async (req, res) => {
  try {
    const col = ["role_id", "name", "level"];

    const check_un = await Role.get({ role_id: { [Op.ne]: 0 } }, col);

    if (!check_un.success) return response.internalServerError("Error get role", res);

    if (check_un.count == 0) return response.notFound("Role not found", res);

    return response.success("Success get role", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get role", res);
  }
};

const updateRole = async (req, res) => {

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(["name"], req.body);
  if (miss) return response.badRequest(miss, res);

  try {
    const upd = await Role.upd({ name: req.body.name }, { role_id: req.params.role_id });

    if (upd.success) return response.created("Success update role", res, { role_id: req.params.role_id });

    return response.serviceUnavailable("Error transaction update role", res);
  } catch (error) {
    return response.internalServerError("Error update role", res);
  }
};

module.exports = { getRole, getAllRole, updateRole };
