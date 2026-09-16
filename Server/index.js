const express = require("express");
const cors = require("cors");

require("dotenv").config();
const productRoutes = require("./router/productRouter.js")
const categoryRoutes = require("./router/categoryRouter.js")

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(
    "/api/products", productRoutes
)
app.use(
  "/api/categories", categoryRoutes
)
const PORT = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})