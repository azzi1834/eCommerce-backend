const routes = require("express").Router();
const addressController = require("../controllers/addressController");

routes.post("/save-address", async (req, res) => {
  const response = await addressController.addAddress(req, res);
  if (response) {
    return res.status(200).json(response);
  } else return res.status(401).json("failed to add address");
});

routes.get("/get-addresses", async (req, res) => {
  const response = await addressController.getAddresses(req, res);
  console.log("response", response);
  if (response) {
    return res.status(200).json(response);
  } else return res.status(401).json("failed to add address");
});

routes.get("/get-address", async (req, res) => {
  const response = await addressController.getAddress(req, res);
  if (response) {
    return res.status(200).json(response);
  } else return res.status(401).json("failed to add address");
});

routes.get("/:id/get-address", async (req, res) => {
  const response = await addressController.deleteAddress(req, res);
  if (response) {
    return res.status(200).json(response);
  } else return res.status(401).json("failed to delete address");
});

module.exports = routes;
