"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    static associate(models) {
      models.cart.belongsTo(models.user, { foreignKey: "userId" });
      models.cart.belongsTo(models.product, { foreignKey: "productId" });
    }
  }
  cart.init(
    {
      quantity: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "cart",
    }
  );
  return cart;
};
