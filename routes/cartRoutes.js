const routes = require("express").Router();
const cartController = require("../controllers/cartController");

routes.post("/:id/add-to-cart", async (req, res) => {
  const response = await cartController.addToCart(req, res);
  if (response.status === 0) {
    return res.status(500).json("internal server error");
  } else if (response.status === 201) {
    return res.json(response.message);
  } else return res.status(200).json("added to cart succesfully");
});

routes.get("/view-cart", async (req, res) => {
  const response = await cartController.viewCart(req, res);

  if (response) {
    return res.status(200).json(response);
  } else return res.status(404).json("internal server error");
});

routes.put("/:id/update-cart", async (req, res) => {
  const response = await cartController.updateCart(req, res);
  if (response[0] === 1) {
    return res.status(200).json("update successfuly");
  } else return res.status(401).json("unable to update");
});

routes.delete("/:id/remove-item", async (req, res) => {
  const response = await cartController.removeCartItem(req, res);

  if (response === 0) {
    return res.status(200).json("no product to remove");
  } else if (response === 1) {
    return res.status(200).json("removed succesfully");
  }
  return res.status(401).json("internal server error");
});

routes.delete("/clear-cart", async (req, res) => {
  const response = await cartController.clearCart(req, res);

  if (response === 0) {
    return res.status(200).json("no product to remove");
  } else if (response > 0) {
    return res.status(200).json("removed succesfully");
  }
  return res.status(401).json("internal server error");
});

module.exports = routes;
