"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class AppRelease extends Model {}
AppRelease.init(
  {
    filename: {
      field: "filename",
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
    },
    version: {
      field: "version",
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    date: {
      field: "date",
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize: db_smbsm,
    modelName: "AppRelease",
    timestamps: false,
    tableName: "app_release",
    id: false,
  },
);

AppRelease.get = async (cond = {}, col = []) => {
  const attr = col.length == 0 ? {} : { attributes: col };
  try {
    const stat_find = await AppRelease.findAll({ where: cond, ...attr, order: [["date", "DESC"]] });
    return {
      success: true,
      count: stat_find.length,
      data: stat_find,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

module.exports = AppRelease;
