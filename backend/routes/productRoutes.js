const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.get("/products/:user_id", getProducts);

router.post("/products", upload.single("image"), addProduct);

router.delete("/products/:id", deleteProduct);

router.put("/products/:id", upload.single("image"), updateProduct);

module.exports = router;