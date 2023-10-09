"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    // In the Review model
    static associate(models) {
      models.review.belongsTo(models.user, { foreignKey: "userId" });
      models.review.belongsTo(models.product, { foreignKey: "productId" });
    }
  }
  review.init(
    {
      rating: DataTypes.FLOAT,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "review",
    }
  );
  return review;
};
