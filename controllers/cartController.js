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

  console.log("req.body", req.body);

  //check if product aleady added to cart
  const existingItem = await Cart.findOne({
    where: { userId, productId },
  });

  console.log("exiting_item", existingItem);

  if (existingItem) {
    return {
      status: 201,
      message: "Already Added! Go to cart and update quantity",
    };
  } else {
    const response = await Cart.create(req.body);
    // console.log("added to cart response", response);
    return response;
  }

  //if yes then update quantity and price
  // if (existingItem) {
  //   existingItem.quantity += quantity;
  //   existingItem.price += price;

  //   await existingItem.save();
  //   return {
  //     status: 201,
  //     message: "Already Added! updated cart",
  //   };
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

  let totalCost = 0;

  response.map((item) => {
    totalCost += item.price * item.quantity;
  });

  return [totalCost, ...response];
};

//to update quantity
const updateCart = async (req, res) => {
  const userId = req.user.id;
  const productId = toInteger(req.params.id);
  const quantity = req.body.quantity; // New quantity value

  console.log("quantity in updateCart", quantity);

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

  // console.log("userId:", userId);
  // console.log("productId:", productId);

  const response = await Cart.destroy({
    where: {
      userId,
      productId,
    },
  });

  // console.log("response", response);

  if (response === 1) {
    const result = await Cart.findAll({
      where: {
        userId,
      },
      include: Product,
    });

    if (result) {
      return result;
    }
  }
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

// const increaseQty = async (req, res) => {
//   const userId = req.user.id;

//   await Cart.update{}

// };

module.exports = {
  addToCart,
  viewCart,
  updateCart,
  removeCartItem,
  clearCart,
};
