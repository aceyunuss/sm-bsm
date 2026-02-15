const response = require("../utils/response");
const validate = require("../utils/validation");
const Visit = require("../models/Visit");

const checkIn = async (req, res) => {
  const required = ["user_id", "check_in", "long", "lat", "location"];

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

module.exports = { checkIn, checkOut };
