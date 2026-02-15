"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class Role extends Model {}
Role.init(
  {
    role_id: {
      field: "role_id",
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
    level: {
      field: "level",
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    sequelize: db_smbsm,
    modelName: "Role",
    timestamps: false,
    tableName: "mst_roles",
  },
);

Role.get = async (cond = {}, col = []) => {
  const attr = col.length == 0 ? {} : { attributes: col };
  try {
    const stat_find = await Role.findAll({ where: cond, ...attr });
    return {
      success: true,
      count: stat_find.length,
      data: stat_find,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

Role.ins = async (data) => {
  try {
    const stat_ins = await Role.create(data);
    return {
      success: true,
      count: 1,
      data: stat_ins.role_id,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

Role.upd = async (data, cond) => {
  try {
    const stat_upd = await Role.update(data, { where: cond });

    return {
      success: true,
      count: stat_upd[0],
    };
  } catch (error) {    
    return { success: false, msg: error.message };
  }
};

module.exports = Role;
