const path = require("path");
const fs = require("fs");
const response = require("../utils/response");
const validate = require("../utils/validation");
const Visit = require("../models/Visit");

const checkIn = async (req, res) => {
  const required = ["user_id", "check_in", "long", "lat", "location", "tenant_id", "sub_tenant_id"];

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(required, req.body);
  if (miss) return response.badRequest(miss, res);

  const photoFile = req.files?.photo?.[0];
  const attachmentFile = req.files?.attachment?.[0];

  if (!photoFile) return response.badRequest("Field photo is required", res);

  try {
    const data = {
      user_id: req.body.user_id,
      check_in: req.body.check_in,
      long: req.body.long,
      lat: req.body.lat,
      photo: photoFile.path,
      attachment: attachmentFile ? attachmentFile.path : null,
      notes: req.body.notes,
      location: req.body.location,
      tenant_id: req.body.tenant_id,
      sub_tenant_id: req.body.sub_tenant_id,
      created_date: new Date().toISOString(),
    };

    const ins = await Visit.ins(data);
    if (ins.success) return response.created("Success check in", res, { visit_id: ins.data.visit_id });

    return response.serviceUnavailable("Error insert transaction check in", res);
  } catch (error) {
    return response.internalServerError("Error check in", res);
  }
};

const checkOut = async (req, res) => {
  const required = ["visit_id", "user_id", "check_out", "long1", "lat1", "location1"];

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(required, req.body);
  if (miss) return response.badRequest(miss, res);

  const photoFile = req.files?.photo1?.[0];
  const attachmentFile = req.files?.attachment1?.[0];

  if (!photoFile) return response.badRequest("Field photo1 is required", res);

  try {
    const check = await Visit.get({ visit_id: req.body.visit_id });

    if (check.success) {
      if (check.count == 0) return response.notFound("Visit not found", res);
      if (check.data[0].check_out != null) return response.conflict("Visit already checked out", res);
    }

    const data = {
      user_id: req.body.user_id,
      check_out: req.body.check_out,
      long1: req.body.long1,
      lat1: req.body.lat1,
      location1: req.body.location1,
      photo1: photoFile.path,
      notes1: req.body.notes1,
      attachment1: attachmentFile ? attachmentFile.path : null,
      updated_date: new Date().toISOString(),
    };

    const upd = await Visit.upd(data, { visit_id: req.body.visit_id });

    if (upd.success) return response.created("Success check out", res, { visit_id: req.body.visit_id });

    return response.serviceUnavailable("Error transaction check out", res);
  } catch (error) {
    return response.internalServerError("Error check out", res);
  }
};

const getHistory = async (req, res) => {
  const is_visit_id = await validate.isExist(req.params.visit_id);
  if (!is_visit_id) return response.badRequest("Visit id is required", res);

  try {
    const check_un = await Visit.get({ visit_id: req.params.visit_id });

    if (!check_un.success) return response.internalServerError("Error get history", res);
    if (check_un.count == 0) return response.notFound("History not found", res);

    return response.success("Success get history", res, check_un.data[0]);
  } catch (error) {
    return response.internalServerError("Error get history", res);
  }
};

const getHistoryUser = async (req, res) => {
  const is_user_id = await validate.isExist(req.params.user_id);
  if (!is_user_id) return response.badRequest("User id is required", res);

  try {
    const check_un = await Visit.get({ user_id: req.params.user_id });
    if (!check_un.success) return response.internalServerError("Error get history", res);
    if (check_un.count == 0) return response.notFound("History not found", res);

    return response.success("Success get history", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get history", res);
  }
};

const getHistoryTenant = async (req, res) => {
  const is_tenant_id = await validate.isExist(req.params.tenant_id);
  if (!is_tenant_id) return response.badRequest("Tenant id is required", res);

  try {
    const check_un = await Visit.get({ tenant_id: req.params.tenant_id });
    if (!check_un.success) return response.internalServerError("Error get history", res);
    if (check_un.count == 0) return response.notFound("History not found", res);

    return response.success("Success get history", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get history", res);
  }
};

const getHistorySubTenant = async (req, res) => {
  const is_sub_tenant_id = await validate.isExist(req.params.sub_tenant_id);
  if (!is_sub_tenant_id) return response.badRequest("Sub tenant id is required", res);

  try {
    const check_un = await Visit.get({ sub_tenant_id: req.params.sub_tenant_id });
    if (!check_un.success) return response.internalServerError("Error get history", res);
    if (check_un.count == 0) return response.notFound("History not found", res);

    return response.success("Success get history", res, check_un.data);
  } catch (error) {
    return response.internalServerError("Error get history", res);
  }
};

const getPhoto = async (req, res) => {
  const is_visit_id = await validate.isExist(req.params.visit_id);
  if (!is_visit_id) return response.badRequest("Visit id is required", res);

  try {
    const check = await Visit.get({ visit_id: req.params.visit_id });

    if (!check.success) return response.internalServerError("Error get photo", res);
    if (check.count == 0) return response.notFound("Visit not found", res);

    const filePath = path.resolve(check.data[0].photo);

    if (!fs.existsSync(filePath)) return response.notFound("Photo not found", res);

    return res.sendFile(filePath);
  } catch (error) {
    return response.internalServerError("Error get photo", res);
  }
};

module.exports = { checkIn, checkOut, getHistory, getHistoryUser, getHistoryTenant, getHistorySubTenant, getPhoto };
