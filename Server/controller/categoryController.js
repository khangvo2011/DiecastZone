const db = require("../config/firebase");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = {
      name,
      createDate: new Date(),
    };

    const docRef = await db.collection("categories").add(category);

    res.status(201).json({
      id: docRef.id,
      ...category,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    res.status(500).json({
      message: "Create category failed",
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const snapshot = await db.collection("categories").get();

    const categories = [];

    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);

    res.status(500).json({
      message: "Get categories failed",
      error: error.message,
    });
  }
};

// GET ONE CATEGORY
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("categories").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error("Error getting category:", error);

    res.status(500).json({
      message: "Get category failed",
      error: error.message,
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const categoryRef = db.collection("categories").doc(id);

    const category = await categoryRef.get();

    if (!category.exists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await categoryRef.update({
      name,
      updateDate: new Date(),
    });

    const updatedCategory = await categoryRef.get();

    res.json({
      id: updatedCategory.id,
      ...updatedCategory.data(),
    });
  } catch (error) {
    console.error("Error updating category:", error);

    res.status(500).json({
      message: "Update category failed",
      error: error.message,
    });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryRef = db.collection("categories").doc(id);

    const category = await categoryRef.get();

    if (!category.exists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await categoryRef.delete();

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);

    res.status(500).json({
      message: "Delete category failed",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
