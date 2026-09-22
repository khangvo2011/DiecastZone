const db = require("../config/firebase");

const createOrder = async (req, res) => {
  try {
    const { userId, customer, items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      return res.status(400).json({
        message: "Customer information is incomplete",
      });
    }

    const total = items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

    const order = {
      userId: userId || null,

      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
      },

      items,

      paymentMethod: paymentMethod || "COD",

      total,

      status: "pending",

      createdAt: new Date(),
    };

    const docRef = await db.collection("orders").add(order);

    res.status(201).json({
      id: docRef.id,
      ...order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Create order failed",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();

    const orders = [];

    snapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Get orders failed",
      error: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("orders").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      message: "Get order failed",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const orderRef = db.collection("orders").doc(id);

    const order = await orderRef.get();

    if (!order.exists) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await orderRef.update({
      status,
      updatedAt: new Date(),
    });

    res.json({
      id,
      status,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Update order status failed",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
};
