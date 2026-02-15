const response = require("../utils/response");
const validate = require("../utils/validation");
const Tenant = require("../models/Tenant");

const getTenant = async (req, res) => {
  const is_tenant_id = await validate.isExist(req.params.tenant_id);
  if (!is_tenant_id) return response.badRequest("Tenant id is required", res);

  try {
    const col = ["tenant_id", "name", "is_active", "address"];

    const check_un = await Tenant.get({ tenant_id: req.params.tenant_id }, col);

    if (!check_un.success) return response.internalServerError("Error get tenant", res);

    if (check_un.count == 0) return response.notFound("Tenant not found", res);

    return response.success("Success get tenant", res, check_un.data[0]);
  } catch (error) {
    return response.internalServerError("Error get tenant", res);
  }
};

const getAllTenant = async (req, res) => {
  try {
    const col = ["tenant_id", "name", "is_active", "address"];

    const check_un = await Tenant.get({}, col);

    if (!check_un.success) return response.internalServerError("Error get tenant", res);

    if (check_un.count == 0) return response.notFound("Tenant not found", res);

    return response.success("Success get tenant", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get tenant", res);
  }
};

const insertTenant = async (req, res) => {
  const required = ["name", "address", "created_by"];

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(required, req.body);
  if (miss) return response.badRequest(miss, res);

  try {
    const data = {
      name: req.body.name,
      address: req.body.address,
      is_active: "1",
      created_by: req.body.created_by,
      created_date: new Date().toISOString(),
    };

    const ins = await Tenant.ins(data);
    if (ins.success) return response.created("Success insert tenant", res, { tenant_id: ins.data });

    return response.serviceUnavailable("Error transaction insert tenant", res);
  } catch (error) {
    return response.internalServerError("Error insert tenant", res);
  }
};

const updateTenant = async (req, res) => {
  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  try {
    const data = {
      updated_date: new Date(),
      updated_by: req.body.updated_by,
    };

    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.is_active !== undefined) data.is_active = req.body.is_active;
    if (req.body.address !== undefined) data.address = req.body.address;

    const upd = await Tenant.upd(data, { tenant_id: req.params.tenant_id });

    if (upd.success) return response.success("Success update tenant", res, { tenant_id: req.params.tenant_id });

    return response.serviceUnavailable("Error transaction update tenant", res);
  } catch (error) {
    return response.internalServerError("Error update tenant", res);
  }
};

module.exports = { getTenant, getAllTenant, insertTenant, updateTenant };
