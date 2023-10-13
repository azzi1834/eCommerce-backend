"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class addresses extends Model {
    static associate(models) {
      models.addresses.belongsTo(models.user, { foreignKey: "userId" });
    }
  }
  addresses.init(
    {
      name: DataTypes.STRING,
      contactNumber: DataTypes.STRING,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      addressType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "addresses",
    }
  );
  return addresses;
};
