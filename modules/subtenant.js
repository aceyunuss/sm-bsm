const response = require("../utils/response");
const validate = require("../utils/validation");
const SubTenant = require("../models/SubTenant");

const getSubTenant = async (req, res) => {
  const is_sub_tenant_id = await validate.isExist(req.params.sub_tenant_id);
  if (!is_sub_tenant_id) return response.badRequest("Sub Tenant id is required", res);

  try {
    const col = ["sub_tenant_id", "tenant_id", "name", "is_active", "address"];
    const check_un = await SubTenant.get({ sub_tenant_id: req.params.sub_tenant_id }, col);
    if (!check_un.success) return response.internalServerError("Error get sub tenant", res);

    if (check_un.count == 0) return response.notFound("Sub Tenant not found", res);

    return response.success("Success get sub tenant", res, check_un.data[0]);
  } catch (error) {
    return response.internalServerError("Error get sub tenant", res);
  }
};

const getAllSubTenant = async (req, res) => {
  try {
    const col = ["sub_tenant_id", "tenant_id", "name", "is_active", "address"];

    const check_un = await SubTenant.get({}, col);

    if (!check_un.success) return response.internalServerError("Error get sub tenant", res);
    if (check_un.count == 0) return response.notFound("Sub Tenant not found", res);

    return response.success("Success get sub tenant", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get sub tenant", res);
  }
};

const insertSubTenant = async (req, res) => {
  const required = ["tenant_id", "name", "address", "created_by"];

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(required, req.body);
  if (miss) return response.badRequest(miss, res);

  try {
    const data = {
      tenant_id: req.body.tenant_id,
      name: req.body.name,
      address: req.body.address,
      is_active: "1",
      created_by: req.body.created_by,
      created_date: new Date().toISOString(),
    };

    const ins = await SubTenant.ins(data);
    if (ins.success) return response.created("Success insert sub tenant", res, { sub_tenant_id: ins.data });

    return response.serviceUnavailable("Error transaction insert sub tenant", res);
  } catch (error) {
    return response.internalServerError("Error insert sub tenant", res);
  }
};

const updateSubTenant = async (req, res) => {
  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  try {
    const data = {
      updated_date: new Date(),
      updated_by: req.body.updated_by,
    };

    if (req.body.tenant_id !== undefined) data.tenant_id = req.body.tenant_id;
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.is_active !== undefined) data.is_active = req.body.is_active;
    if (req.body.address !== undefined) data.address = req.body.address;

    const upd = await SubTenant.upd(data, { sub_tenant_id: req.params.sub_tenant_id });

    if (upd.success) return response.success("Success update sub tenant", res, { sub_tenant_id: req.params.sub_tenant_id });

    return response.serviceUnavailable("Error transaction update sub tenant", res);
  } catch (error) {
    return response.internalServerError("Error update sub tenant", res);
  }
};

module.exports = { getSubTenant, getAllSubTenant, insertSubTenant, updateSubTenant };
