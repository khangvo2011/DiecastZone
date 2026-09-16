const express = require("express");

const router = express.Router();

const multer = require("multer");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController.js");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);

router.get("/:id",getProduct)

router.put("/:id", upload.single("image"), updateProduct)

router.delete("/:id", deleteProduct)

module.exports = router
