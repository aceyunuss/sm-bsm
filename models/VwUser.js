"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class VwUser extends Model {}
VwUser.init(
  {
    user_id: {
      field: "user_id",
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      field: "username",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    nip: {
      field: "nip",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    name: {
      field: "name",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      field: "email",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      field: "password",
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
    tenant_id: {
      field: "tenant_id",
      type: DataTypes.INTEGER,
    },
    sub_tenant_id: {
      field: "sub_tenant_id",
      type: DataTypes.INTEGER,
    },
    role_id: {
      field: "role_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      field: "level",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role_name: {
      field: "role_name",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tenant_name: {
      field: "tenant_name",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sub_tenant_name: {
      field: "sub_tenant_name",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize: db_smbsm,
    modelName: "VwUser",
    timestamps: false,
    tableName: "vw_users",
  },
);

VwUser.get = async (cond = {}, col = []) => {
  const attr = col.length == 0 ? {} : { attributes: col };
  try {
    const stat_find = await VwUser.findAll({
      where: cond,
      ...attr,
    });
    return {
      success: true,
      count: stat_find.length,
      data: stat_find,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

module.exports = VwUser;
