const db = require("../config/firebase");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (req, res) => {
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
    streamifier.createReadStream(req.file.buffer).pipe(stream);
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
      const result = await uploadToCloudinary(req, res);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }
    const product = {
      name,
      price: Number(price),
      description: description || "",
      image_url,
      publicId,
      createAt: new Date(),
    };
    const category = {
        name, 
        createAt: new Date(),
    }
    const docRef = await db.collection("products").add(product);
    res.status(201).json({ id: docRef.id, ...product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = [];
    snapshot.foreach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Get product failed",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("products").doc(id).get;
    if (!id.exists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Get product failed",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = db.collection("products").doc(id);
    const oldproduct = await productRef.get();
    if (!oldproduct.exists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const oldData = oldproduct.data();
    const updateData = {
      ...req.boy,
      updateAt: new Date(),
    };
    if (req.body.price) {
      updateData.price = Number(req.body.price);
    }
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      updateData.imageUrl = result.secure_url;
      updateData.publicId = result.publicId;

      if (oldData.publicId) {
        await cloudinary.uploader.destroy(oldData.publicId);
      }
    }
    await productRef.update(updateData);
    const updatedProduct = await productRef.get();
    res.json({
      id: updatedProduct.id,
      ...updateProduct.data(),
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
    const {id} = req.params
    const productRef = db.collection("products").doc(id)
    const product = await productRef.get()
    if(!product.exists){
        return res.status(404).json({
            message : "Product not found"
        })
    }

    const data = product.data()
    if(data.publicId){
        await cloudinary.uploader.destroy(data.publicId)
    }

    await productRef.delete()

    res.json({
        message: "Deleted succesfully"
    })


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
}