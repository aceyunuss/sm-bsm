"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class Tenant extends Model {}
Tenant.init(
  {
    tenant_id: {
      field: "tenant_id",
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      field: "name",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      field: "is_active",
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    address: {
      field: "address",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_date: {
      field: "created_date",
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      field: "created_by",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    updated_date: {
      field: "updated_date",
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_by: {
      field: "updated_by",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize: db_smbsm,
    modelName: "Tenant",
    timestamps: false,
    tableName: "mst_tenant",
  },
);

Tenant.get = async (cond = {}, col = []) => {
  const attr = col.length == 0 ? {} : { attributes: col };
  try {
    const stat_find = await Tenant.findAll({ where: cond, ...attr });
    return {
      success: true,
      count: stat_find.length,
      data: stat_find,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

Tenant.ins = async (data) => {
  try {
    const stat_ins = await Tenant.create(data);
    return {
      success: true,
      count: 1,
      data: stat_ins.tenant_id,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

Tenant.upd = async (data, cond) => {
  try {
    const stat_upd = await Tenant.update(data, { where: cond });

    return {
      success: true,
      count: stat_upd[0],
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

module.exports = Tenant;
