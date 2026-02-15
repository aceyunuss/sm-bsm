"use strict";
const { Model, DataTypes } = require("sequelize");
const { db_smbsm } = require("../config/database");

class User extends Model {}
User.init(
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
    dob: {
      field: "dob",
      type: DataTypes.DATEONLY,
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
  },
  {
    sequelize: db_smbsm,
    modelName: "User",
    timestamps: false,
    tableName: "mst_users",
  },
);

User.get = async (cond = {}, col = []) => {
  const attr = col.length == 0 ? {} : { attributes: col };
  try {
    const stat_find = await User.findAll({
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

User.insert = async (data) => {
  try {
    const stat_ins = await User.create(data);
    return {
      success: true,
      count: 1,
      data: stat_ins.user_id,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

module.exports = User;
