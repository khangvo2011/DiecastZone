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
const { requireAdmin } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", requireAdmin, upload.single("image"), createProduct);

router.get("/", getProducts);

router.get("/:id",getProduct)

router.put("/:id", requireAdmin, upload.single("image"), updateProduct)

router.delete("/:id", requireAdmin, deleteProduct)

module.exports = router
