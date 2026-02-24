"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class Report extends Model {}

Report.init(
  {
    visit_id: {
      field: "visit_id",
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: { field: "date", type: DataTypes.DATEONLY },
    name: { field: "name", type: DataTypes.STRING },
    role: { field: "role", type: DataTypes.STRING },
    sub_tenant: { field: "sub_tenant", type: DataTypes.STRING },
    tenant: { field: "tenant", type: DataTypes.STRING },
    check_in: { field: "check_in", type: DataTypes.DATE },
    check_out: { field: "check_out", type: DataTypes.DATE },
    duration: { field: "duration", type: DataTypes.STRING },
    photo: { field: "photo", type: DataTypes.STRING },
    attachment: { field: "attachment", type: DataTypes.STRING },
    notes: { field: "notes", type: DataTypes.STRING },
    location: { field: "location", type: DataTypes.STRING },
    long: { field: "long", type: DataTypes.STRING },
    lat: { field: "lat", type: DataTypes.STRING },
    photo1: { field: "photo1", type: DataTypes.STRING },
    attachment1: { field: "attachment1", type: DataTypes.STRING },
    notes1: { field: "notes1", type: DataTypes.STRING },
    location1: { field: "location1", type: DataTypes.STRING },
    long1: { field: "long1", type: DataTypes.STRING },
    lat1: { field: "lat1", type: DataTypes.STRING },
  },
  {
    sequelize: db_smbsm,
    modelName: "Report",
    tableName: "vw_report",
    timestamps: false,
  },
);

Report.get = async (cond = {}, col = [], order = [], limit = null, offset = 0) => {
  const attr = col.length === 0 ? {} : { attributes: col };
  const orderBy = order.length === 0 ? {} : { order };
  const limitBy = limit ? { limit, offset } : {};
  try {
    const data = await Report.findAll({
      where: cond,
      ...attr,
      ...orderBy,
      ...limitBy,
    });
    return { success: true, count: data.length, data };
  } catch (error) {
    console.log("==========================START============================");
    console.log(error);
    console.log("===========================END=============================");

    return { success: false, msg: error.message };
  }
};

module.exports = Report;
