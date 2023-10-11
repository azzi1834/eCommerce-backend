const db = require("../models");
const Cart = db.cart;
const { toInteger } = require("lodash");
const Product = db.product;

const addToCart = async (req, res) => {
  console.log("in addToCart controller");
  const productId = toInteger(req.params.id);
  const userId = req.user.id;

  req.body.userId = userId;
  req.body.productId = productId;

  const { quantity, price } = req.body;

  console.log("req.body", req.body);

  //check if product aleady added to cart
  const existingItem = await Cart.findOne({
    where: { userId, productId },
  });

  console.log("exiting_item", existingItem);

  //if yes then update quantity and price
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price += price;

    await existingItem.save();
    return {
      status: 201,
      message: "Already Added! updated cart",
    };
  } else {
    const response = await Cart.create(req.body);
    // console.log("added to cart response", response);
    return response;
  }
};

const viewCart = async (req, res) => {
  userId = req.user.id;

  const response = await Cart.findAll({
    where: {
      userId,
    },
    include: Product, //eager loading : quering data of serveral models
  });

  console.log("response", response);

  //   let totalCost = 0;

  //   response.map((item) => {
  //     totalCost += item.price * item.quantity;
  //   });

  return response;
};

//to update quantity
const updateCart = async (req, res) => {
  const userId = req.user.id;
  const productId = toInteger(req.params.id);
  const quantity = req.body.quantity; // New quantity value

  const result = await Cart.update(
    {
      quantity,
      ...req.body,
    },
    {
      where: { userId, productId },
    }
  );
  return result;
};

const removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const productId = toInteger(req.params.id);

  const response = await Cart.destroy({
    where: {
      userId,
      productId,
    },
  });

  return response;
};

const clearCart = async (req, res) => {
  const userId = req.user.id;

  const response = await Cart.destroy({
    where: {
      userId,
    },
  });

  return response;
};

module.exports = {
  addToCart,
  viewCart,
  updateCart,
  removeCartItem,
  clearCart,
};
