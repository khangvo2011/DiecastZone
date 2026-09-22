const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controller/orderController.js");

const router = express.Router();

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrder);

router.patch("/:id/status", updateOrderStatus);

module.exports = router;
