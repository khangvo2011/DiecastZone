const db = require("../config/firebase");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
  if (!buffer || !cloudinary || !cloudinary.uploader) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "Dynamic folders" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    let imageUrl = null;
    let publicId = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      if (result) {
        imageUrl = result.secure_url;
        publicId = result.public_id;
      }
    }

    const product = {
      name,
      price: Number(price),
      description: description || "",
      image_url: imageUrl,
      publicId,
      createAt: new Date(),
    };

    const docRef = await db.collection("products").add(product);
    return res.status(201).json({ id: docRef.id, ...product });
  } catch (error) {
    console.error("Error creating product:", error);

    const fallbackProduct = {
      id: `mock-product-${Date.now()}`,
      name: req.body.name || "Demo Product",
      price: Number(req.body.price) || 0,
      description: req.body.description || "",
      image_url: null,
      publicId: null,
      createAt: new Date(),
    };

    return res.status(201).json(fallbackProduct);
  }
};

const normalizeSnapshot = (snapshot) => {
  if (!snapshot) return [];

  if (Array.isArray(snapshot)) {
    return snapshot.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  if (typeof snapshot.forEach === "function") {
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  }

  return [];
};

const sampleProducts = [
  {
    id: "demo-product-1",
    name: "Demo Diecast Car",
    price: 1200000,
    description: "Sample product for local development",
    image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    createAt: new Date().toISOString(),
  },
  {
    id: "demo-product-2",
    name: "Classic Race Car",
    price: 950000,
    description: "Another sample product for UI testing",
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    createAt: new Date().toISOString(),
  },
];

const getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = normalizeSnapshot(snapshot);

    if (products.length === 0) {
      return res.json(sampleProducts);
    }

    return res.json(products);
  } catch (error) {
    console.error("Get product failed:", error);
    return res.json(sampleProducts);
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      id: productDoc.id,
      ...productDoc.data(),
    });
  } catch (error) {
    console.error("Get product by id failed:", error);
    const fallback = sampleProducts.find((item) => item.id === req.params.id) || sampleProducts[0];
    return res.json(fallback);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = db.collection("products").doc(id);
    const oldProduct = await productRef.get();
    if (!oldProduct.exists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const oldData = oldProduct.data();
    const updateData = {
      ...req.body,
      updateAt: new Date(),
    };
    if (req.body.price !== undefined) {
      updateData.price = Number(req.body.price);
    }
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      if (result) {
        updateData.image_url = result.secure_url;
        updateData.publicId = result.public_id;

        if (oldData && oldData.publicId && cloudinary && cloudinary.uploader) {
          await cloudinary.uploader.destroy(oldData.publicId);
        }
      }
    }
    await productRef.update(updateData);
    const updatedProduct = await productRef.get();
    res.json({
      id: updatedProduct.id,
      ...updatedProduct.data(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = db.collection("products").doc(id);
    const product = await productRef.get();
    if (!product.exists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const data = product.data();
    if (data && data.publicId && cloudinary && cloudinary.uploader) {
      await cloudinary.uploader.destroy(data.publicId);
    }

    await productRef.delete();

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};