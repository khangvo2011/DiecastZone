const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const { requireAdmin } = require("../middleware/auth");

router.post("/", requireAdmin, createCategory);
router.get("/",getCategories);

router.get("/:id",getCategory)

router.put("/:id", requireAdmin, updateCategory)

router.delete("/:id", requireAdmin, deleteCategory)

module.exports = router