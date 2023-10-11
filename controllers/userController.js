const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const fs = require("fs");

const deleteUser = async (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      console.log("Successfully deleted record.");
    })
    .catch((error) => {
      console.error("Failed to delete record : ", error);
    });
};

const findUser = async (req, res) => {
  await User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.error("Failed to Found user : ", error);
    });
};

const updateUser = async (req, res) => {
  console.log("req.body", req.body);

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  } //hash password if found

  const response = await User.update(
    {
      profile: req?.file?.path, //save path of images
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  if (response[0] === 1) {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    return user;
  }
  return {
    status: 0,
    message: "unable to update",
  };
};

const updateEmail = async (req, res) => {
  // console.log("req.body in update email", req?.body);

  const data = req?.body;
  const id = req.params.id;

  // console.log("id from useparams", id);

  const user = await User.findOne({
    where: {
      id,
    },
  });

  // console.log("user find by id", user);

  // console.log("data.password", data?.password);
  // console.log("user.password", user?.password);

  const match = await bcrypt.compare(data?.password, user.password);

  if (!match) {
    return {
      status: 0,
      message: "invalid password",
    };
  }

  const response = await User.update(
    {
      profile: req?.file?.path, //save path of images
      ...req.body,
    },
    {
      where: {
        id,
      },
    }
  );

  // console.log("response after updation", response);

  if (response[0] === 1) {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  return {
    status: 401,
    message: "unable to update",
  };
};

const updatePassword = async (req, res) => {
  // console.log("req.body in update password", req?.body);

  const data = req?.body;
  const id = req.params.id;

  // console.log("id from useparams", id);

  const user = await User.findOne({
    where: {
      id,
    },
  });

  // console.log("user find by id", user);

  // console.log("data.password", data?.password);
  // console.log("user.password", user?.password);

  // console.log("data.newPassword", data?.newPassword);

  const match = await bcrypt.compare(data?.password, user?.password);

  console.log("match", match);
  if (!match) {
    return {
      status: 0,
      message: "invalid current password",
    };
  }

  data.newPassword = bcrypt.hashSync(data?.newPassword, 10);

  // console.log("data.newPassword after::::", data.newPassword);

  const response = await User.update(
    {
      profile: req?.file?.path, //save path of images
      ...req.body,
      password: data.newPassword,
    },
    {
      where: {
        id,
      },
    }
  );

  // console.log("response after updation", response);

  if (response[0] === 1) {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    // console.log("user ", user);

    return user;
  }

  return {
    status: 401,
    message: "unable to update",
  };
};

const updateProfile = async (req, res) => {
  const path = await User.findOne({
    //save path of current image to remove later
    where: {
      id: req.params.id,
    },
    attributes: ["profile"],
  });
  //update user profile
  User.update(
    {
      profile: req.file.path,
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then(() => {
      // console.log("profile updated succesfully");
      fs.unlink(path.profile, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    })
    .catch((error) => {
      console.error("Failed to update : ", error);
    });
};

const getAllUsers = async (req, res) => {
  const user = await User.findAll()
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.error("Failed to Found user : ", error);
    });
};

module.exports = {
  deleteUser,
  findUser,
  updateUser,
  getAllUsers,
  updateProfile,
  updateEmail,
  updatePassword,
};
