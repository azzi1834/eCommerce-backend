const db = require("../models");
const Product = db.product;
const User = db.user;
const { Op } = require("sequelize");
const fs = require("fs");
const multer = require("multer");
const { toInteger } = require("lodash");
const Review = db.review;

const createProduct = async (req, res) => {
  //create seprate array of path // array of strings // also converting into string at same time
  const productImages = req.files.map((file) => file.path).toString();

  const product = await Product.create({
    images: productImages,
    ...req.body,
  });
  return product;
};

const updateProduct = async (req, res) => {
  const productImages = req.files.map((file) => file.path).toString();

  Product.update(
    {
      images: productImages,
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((res) => {
      console.log("product updated succesfully", res);
    })
    .catch((error) => {
      console.error("Failed to update : ", error);
    });
};

const deleteProduct = async (req, res) => {
  //code to remove images after deleting products
  //save path
  const path = await Product.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["images"],
  }); //got string

  const pathAray = path?.images?.split(","); //to array of strings
  console.log("array of paths", pathAray);

  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      console.log("Successfully deleted record.");
      console.log("now deleting images from local storage");

      //deleting files form local server also
      pathAray.forEach((path) => {
        fs.unlinkSync(path);
      });
    })
    .catch((error) => {
      console.error("Failed to delete record : ", error);
    });
};

const getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  if (!products) {
    return {
      status: 0,
      message: "unable to fetch products",
    };
  } else {
    const productsWithImagesArray = products.map((product) => {
      const imagePaths = product.images.split(",");
      return {
        ...product,
        images: imagePaths,
      };
    });
    return productsWithImagesArray;
  }
};

const getProductDetails = async (req, res) => {
  console.log("product detail controller");
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  // console.log("product in conroller", product);
  if (!product) {
    return {
      status: 0,
      message: "product not found",
    };
  }
  console.log("product found");
  const imagePaths = product.images.split(",");

  return {
    ...product,
    images: imagePaths,
  };
};

const searchProduct = async (req, res) => {
  const search = req.body.search;
  // console.log(search);
  // console.log(`"${search}"`);
  const result = await Product.findAll({
    where: {
      name: {
        [Op.substring]: `${search}`, //LIKE %search%
      },
    },
  });

  if (result.length > 0) {
    console.log("result", result);
    // return result;

    const productsWithImagesArray = result.map((product) => ({
      ...product,
      images: product?.dataValues?.images?.split(","),
    }));
    console.log("productsWithImagesArray", productsWithImagesArray);
    return productsWithImagesArray;
  } else {
    return {
      status: 0,
      message: "Nothig to show",
    };
  }
};

const createReview = async (req, res) => {
  const productId = toInteger(req.params.id);
  const userId = req.user.id;

  req.body.userId = userId;
  req.body.productId = productId;

  const product = await Review.create(req.body);
  return product;
};

//return reviews against particular product
const getReviews = async (req, res) => {
  //if need product info also
  // const data = await Product.findAll({
  //   where: {
  //     id: req.params.id,
  //   },
  //   include: {
  //     model: Review, //associated reviews
  //     include: User, //associated user
  //   },
  // });

  // data.forEach((product) => {
  //   console.log(product);
  //   product.reviews.forEach((review) => {
  //     console.log(review.rating, review.message, review.user.firstName);
  //   });
  // });
  // return data;

  //if need reviews only
  const reviews = await Review.findAll({
    where: {
      productId: req.params.id,
    },
    include: User,
  });

  return reviews;
};

const getProductByCategory = async (req, res) => {
  const category = req.params.category;

  const products = await Product.findAll({
    where: {
      category: {
        [Op.substring]: `${category}`, //LIKE %search%
      },
    },
  });
  if (products.length > 0) {
    const productsWithImagesArray = products.map((product) => ({
      ...product,
      images: product?.dataValues?.images?.split(","),
    }));
    console.log("productsWithImagesArray", productsWithImagesArray);
    return productsWithImagesArray;
  } else
    return {
      status: 0,
      message: "not found",
    };
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images/Product");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage }).array("images", 3);

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  searchProduct,
  upload,
  createReview,
  getReviews,
  getProductByCategory,
};
