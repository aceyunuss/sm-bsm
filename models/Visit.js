"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class Visit extends Model {}

Visit.init(
  {
    visit_id: {
      field: "visit_id",
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      field: "user_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    check_in: {
      field: "check_in",
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_out: {
      field: "check_out",
      type: DataTypes.DATE,
      allowNull: true,
    },
    long: {
      field: "long",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lat: {
      field: "lat",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    photo: {
      field: "photo",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    attachment: {
      field: "attachment",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      field: "notes",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      field: "location",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    long1: {
      field: "long1",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lat1: {
      field: "lat1",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    photo1: {
      field: "photo1",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    attachment1: {
      field: "attachment1",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes1: {
      field: "notes1",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location1: {
      field: "location1",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_date: {
      field: "created_date",
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_date: {
      field: "updated_date",
      type: DataTypes.DATE,
      allowNull: true,
    },
    tenant_id: {
      field: "tenant_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sub_tenant_id: {
      field: "sub_tenant_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db_smbsm,
    modelName: "Visit",
    timestamps: false,
    tableName: "visit",
  },
);

Visit.get = async (cond = {}, col = []) => {
  const attr = col.length === 0 ? {} : { attributes: col };
  try {
    const data = await Visit.findAll({
      where: cond,
      ...attr,
    });
    return {
      success: true,
      count: data.length,
      data,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

Visit.ins = async (data) => {
  try {
    const result = await Visit.create(data);
    return {
      success: true,
      count: 1,
      data: result,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

Visit.upd = async (data, cond) => {
  try {
    const stat_upd = await Visit.update(data, {
      where: cond,
    });

    return {
      success: true,
      count: stat_upd[0],
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

module.exports = Visit;
