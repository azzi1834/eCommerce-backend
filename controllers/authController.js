const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.user;
const { jwtToken } = require("../utils");

const registerUser = async (req, res) => {
  const data = req?.body?.body;
  // const data = req?.body
  // console.log("data in registerUser", data);

  const isUserExist = await User.findOne({
    where: { email: data.email },
  });

  // console.log("is user exist", isUserExist);

  if (isUserExist) {
    return {
      status: 0,
      message: "User already exists",
    };
  } else {
    data.password = bcrypt.hashSync(data?.password, 10); //hashing synchronously 10 times
    // console.log(data?.password);
    // console.log("req.file", req.file);

    const userInfo = {
      // profile: req.file.path,
      ...data,
    };

    const user = await User.create(userInfo);
    const token = jwtToken({ id: user.id, email: user.email });
    return { ...user, token };
  }
};
const loginUser = async (body) => {
  const data = body?.body;
  // const data = body;
  // console.log("body", body);

  const user = await User.findOne({ where: { email: data?.email } });

  if (!user) {
    return {
      status: 0,
      message: "user does not exist",
    };
  } else {
    const match = await bcrypt.compare(data?.password, user.password);
    if (!match) {
      return {
        status: 0,
        message: "user does not exist",
      };
    }
    //if both email and password matched

    const token = jwtToken({ id: user.id, email: user.email });
    return { ...user, token };
  }
};

module.exports = {
  registerUser,
  loginUser,
};
