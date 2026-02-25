const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const response = require("../utils/response");
const validate = require("../utils/validation");
const Visit = require("../models/Visit");
const { Op } = require("sequelize");
const Report = require("../models/Report");
const dotenv = require("dotenv");
const preview = require("../preview");

dotenv.config();

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

const getHistoryFilter = async (req, res) => {
  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  // const miss = await validate.isMissFields(["limit", "offset"], req.body);
  // if (miss) return response.badRequest(miss, res);

  let param = { role_id: 4 };

  if (req.body.user_id !== undefined) param.user_id = req.body.user_id;
  if (req.body.tenant_id !== undefined) param.tenant_id = req.body.tenant_id;
  if (req.body.sub_tenant_id !== undefined) param.sub_tenant_id = req.body.sub_tenant_id;
  if (req.body.start_date !== undefined && req.body.end_date) {
    const startDate = new Date(req.body.start_date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(req.body.end_date);
    endDate.setHours(23, 59, 59, 999);

    param.created_date = { between: [startDate, endDate] };
  }

  const lim = req.body.limit ?? 100;
  const off = req.body.offset ?? 0;

  try {
    const check_un = await Visit.getAll(param, [], [["created_date", "DESC"]], lim, off);

    if (!check_un.success) return response.internalServerError("Error get history", res);
    if (check_un.count == 0) return response.notFound("History not found", res);

    return response.success("Success get history", res, check_un.data);
  } catch (error) {
    console.log("==========================START============================");
    console.log(error);
    console.log("===========================END=============================");

    return response.internalServerError("Error get history", res);
  }
};

const getLastActive = async (req, res) => {
  const is_user_id = await validate.isExist(req.params.user_id);
  if (!is_user_id) return response.badRequest("User id is required", res);

  try {
    const check_un = await Visit.get({ user_id: req.params.user_id, check_out: null }, [], [["created_date", "DESC"]]);

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

const getPhotoIn = async (req, res) => {
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

const getPhotoOut = async (req, res) => {
  const is_visit_id = await validate.isExist(req.params.visit_id);
  if (!is_visit_id) return response.badRequest("Visit id is required", res);

  try {
    const check = await Visit.get({ visit_id: req.params.visit_id });

    if (!check.success) return response.internalServerError("Error get photo", res);
    if (check.count == 0) return response.notFound("Visit not found", res);

    const filePath = path.resolve(check.data[0].photo1);

    if (!fs.existsSync(filePath)) return response.notFound("Photo not found", res);

    return res.sendFile(filePath);
  } catch (error) {
    return response.internalServerError("Error get photo", res);
  }
};

const getAttachmentIn = async (req, res) => {
  const is_visit_id = await validate.isExist(req.params.visit_id);
  if (!is_visit_id) return response.badRequest("Visit id is required", res);

  try {
    const check = await Visit.get({ visit_id: req.params.visit_id });

    if (!check.success) return response.internalServerError("Error get attachment", res);
    if (check.count == 0) return response.notFound("Visit not found", res);

    const attachmentPath = check.data[0].attachment;

    if (!attachmentPath) return response.notFound("Attachment not found", res);

    const filePath = path.resolve(attachmentPath);

    if (!fs.existsSync(filePath)) return response.notFound("File not found", res);

    return res.download(filePath);
  } catch (error) {
    return response.internalServerError("Error get attachment", res);
  }
};

const getAttachmentOut = async (req, res) => {
  const is_visit_id = await validate.isExist(req.params.visit_id);
  if (!is_visit_id) return response.badRequest("Visit id is required", res);

  try {
    const check = await Visit.get({ visit_id: req.params.visit_id });

    if (!check.success) return response.internalServerError("Error get attachment", res);
    if (check.count == 0) return response.notFound("Visit not found", res);

    const attachmentPath = check.data[0].attachment1;

    if (!attachmentPath) return response.notFound("Attachment not found", res);

    const filePath = path.resolve(attachmentPath);

    if (!fs.existsSync(filePath)) return response.notFound("File not found", res);

    return res.download(filePath);
  } catch (error) {
    return response.internalServerError("Error get attachment", res);
  }
};

const generateReportExcel = async (req, res) => {
  const required = ["start_date", "end_date"];

  const is_body = await validate.isExist(req.body);
  if (!is_body) return response.badRequest("Body request are required", res);

  const miss = await validate.isMissFields(required, req.body);
  if (miss) return response.badRequest(miss, res);

  let cond = {};

  if (req.body.tenant_id !== undefined) cond.tenant_id = req.body.tenant_id;
  if (req.body.sub_tenant_id !== undefined) cond.sub_tenant_id = req.body.sub_tenant_id;

  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  cond.date = { [Op.between]: [start_date, end_date] };

  try {
    const check_un = await Report.get(cond);

    if (!check_un.success) return response.internalServerError("Error get history", res);
    if (check_un.count == 0) return response.notFound("History not found", res);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Visit History");

    sheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Date", key: "date", width: 15 },
      { header: "Nama", key: "name", width: 20 },
      { header: "Role", key: "role", width: 15 },
      { header: "Sub Tenant", key: "sub_tenant", width: 20 },
      { header: "Tenant", key: "tenant", width: 20 },
      { header: "Check In", key: "check_in", width: 22 },
      { header: "Check Out", key: "check_out", width: 22 },
      { header: "Duration", key: "duration", width: 20 },
      { header: "Photo In", key: "photo", width: 10 },
      { header: "Attachment In", key: "attachment", width: 12 },
      { header: "Location In", key: "location", width: 40 },
      { header: "Notes In", key: "notes", width: 20 },
      { header: "Photo Out", key: "photo1", width: 10 },
      { header: "Attachment Out", key: "attachment1", width: 12 },
      { header: "Location Out", key: "location1", width: 40 },
      { header: "Notes Out", key: "notes1", width: 20 },
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    });

    check_un.data.forEach((item, index) => {
      const rowIndex = index + 2;

      sheet.addRow({
        no: index + 1,
        date: item.date,
        name: item.name,
        role: item.role,
        sub_tenant: item.sub_tenant,
        tenant: item.tenant,
        check_in: item.check_in ? new Date(item.check_in).toISOString().replace("T", " ").substring(0, 19) : "",
        check_out: item.check_out ? new Date(item.check_out).toISOString().replace("T", " ").substring(0, 19) : "",
        duration: item.duration,
        photo: item.photo ? "LINK" : "",
        attachment: item.attachment ? "LINK" : "",
        location: item.location,
        notes: item.notes ?? "",
        photo1: item.photo1 ? "LINK" : "",
        attachment1: item.attachment1 ? "LINK" : "",
        location1: item.location1,
        notes1: item.notes1 ?? "",
      });

      const url = process.env.BASE_URL + "preview/";

      if (item.photo) {
        const hashed = preview.encrypt(item.photo);
        sheet.getCell(`J${rowIndex}`).value = { text: "LINK", hyperlink: url + hashed };
        sheet.getCell(`J${rowIndex}`).font = { color: { argb: "FF0000FF" }, underline: true };
      }

      if (item.photo1) {
        const hashed = preview.encrypt(item.photo1);
        sheet.getCell(`N${rowIndex}`).value = { text: "LINK", hyperlink: url + hashed };
        sheet.getCell(`N${rowIndex}`).font = { color: { argb: "FF0000FF" }, underline: true };
      }

      if (item.attachment) {
        const hashed = preview.encrypt(item.attachment);
        sheet.getCell(`K${rowIndex}`).value = { text: "LINK", hyperlink: url + hashed };
        sheet.getCell(`K${rowIndex}`).font = { color: { argb: "FF0000FF" }, underline: true };
      }

      if (item.attachment1) {
        const hashed = preview.encrypt(item.attachment1);
        sheet.getCell(`O${rowIndex}`).value = { text: "LINK", hyperlink: url + hashed };
        sheet.getCell(`O${rowIndex}`).font = { color: { argb: "FF0000FF" }, underline: true };
      }

      if (item.location) {
        sheet.getCell(`L${rowIndex}`).value = {
          text: item.location,
          hyperlink: `https://maps.google.com/?q=${item.lat},${item.long}`,
        };
        sheet.getCell(`L${rowIndex}`).font = { color: { argb: "FF0000FF" }, underline: true };
      }
      if (item.location1) {
        sheet.getCell(`P${rowIndex}`).value = {
          text: item.location1,
          hyperlink: `https://maps.google.com/?q=${item.lat1},${item.long1}`,
        };
        sheet.getCell(`P${rowIndex}`).font = { color: { argb: "FF0000FF" }, underline: true };
      }
    });

    const now = new Date().toISOString().replace("T", "_").replace(/:/g, "").substring(0, 19);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=history_${start_date}_${end_date}_${now}.xlsx`);
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    return response.internalServerError("Error generate report", res);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getLastActive,
  getHistory,
  getHistoryFilter,
  getHistoryUser,
  getHistoryTenant,
  getHistorySubTenant,
  getPhotoIn,
  getPhotoOut,
  getAttachmentIn,
  getAttachmentOut,
  generateReportExcel,
};
