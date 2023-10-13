const db = require("../models");
const Address = db.addresses;

const addAddress = async (req, res) => {
  userId = req.user.id;
  req.body.userId = userId;

  const response = await Address.create(req.body);
  if (response) {
    return [response];
  }
};

const getAddresses = async (req, res) => {
  userId = req.user.id;

  const response = await Address.findAll({
    where: {
      userId,
    },
  });
  if (response) {
    return response;
  }
};

const getAddress = async (req, res) => {
  userId = req.user.id;

  const response = await Address.findOne({
    where: {
      userId,
    },
  });
  if (response) {
    return response;
  }
};

// const deleteAddress = async (req, res) => {
//   const i
// };

module.exports = { addAddress, getAddresses, getAddress };
