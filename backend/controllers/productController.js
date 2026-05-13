// has 4 functions: getProducts, addProduct, deleteProduct, updateProduct.

const db = require('../db');
const {
  CODE_PATTERN,
  NAME_PATTERN,
  isOptionalText,
  isPositiveNumber,
  isRequiredText,
} = require("../utils/validation");

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Get products by user
exports.getProducts = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
      p.*,
      COALESCE(mi.quantity, 0) AS quantity
    FROM products p
    LEFT JOIN main_inventory mi ON p.id = mi.product_id
    WHERE p.status = 'active' AND p.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    res.json(result);
  });
};

// Add product
exports.addProduct = (req, res) => {
  const {
    product_code,
    category,
    product_name,
    description,
    retail_price,
    minimum_stock,
    user_id
  } = req.body;

  const image = req.file ? req.file.filename : null;
  const normalizedCategory = normalizeCategory(category);

  if (
    !isRequiredText(product_code, CODE_PATTERN) ||
    !isRequiredText(category, NAME_PATTERN) ||
    !isRequiredText(product_name, NAME_PATTERN) ||
    !isOptionalText(description) ||
    !isPositiveNumber(retail_price) ||
    !isPositiveNumber(minimum_stock)
  ) {
    return res.status(400).json({ message: "Invalid product field format" });
  }

  const checkSql = `
    SELECT id 
    FROM products 
    WHERE product_code = ? 
    AND user_id = ?
    AND status = 'active'
  `;

  db.query(checkSql, [product_code, user_id], (err, existingProduct) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to check product code" });
    }

    if (existingProduct.length > 0) {
      return res.status(400).json({ message: "Product code already exists" });
    }

    const sql = `
      INSERT INTO products 
      (product_code, category, product_name, description, image, retail_price, minimum_stock, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `;

    const values = [
      product_code,
      normalizedCategory,
      product_name,
      description,
      image,
      retail_price,
      minimum_stock,
      user_id
    ];

    db.query(sql, values, (err) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: "Failed to add product" });
      }

      res.json({ message: "Product added successfully" });
    });
  });
};

// Delete product 
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE products SET status = 'inactive' WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to delete product" });
    }

    res.json({ message: "Product deleted successfully" });
  });
};

// Update product
exports.updateProduct = (req, res) => {
  const { id } = req.params;

  const {
    product_code,
    category,
    product_name,
    description,
    retail_price,
    minimum_stock
  } = req.body;

  const normalizedCategory = normalizeCategory(category);

  if (
    !isRequiredText(product_code, CODE_PATTERN) ||
    !isRequiredText(category, NAME_PATTERN) ||
    !isRequiredText(product_name, NAME_PATTERN) ||
    !isOptionalText(description) ||
    !isPositiveNumber(retail_price) ||
    !isPositiveNumber(minimum_stock)
  ) {
    return res.status(400).json({ message: "Invalid product field format" });
  }

  let sql;
  let values;

  if (req.file) {
    const image = req.file.filename;

    sql = `
      UPDATE products
      SET product_code=?, category=?, product_name=?, description=?, image=?, retail_price=?, minimum_stock=?
      WHERE id=?
    `;

    values = [
      product_code,
      normalizedCategory,
      product_name,
      description,
      image,
      retail_price,
      minimum_stock,
      id
    ];
  } else {
    sql = `
      UPDATE products
      SET product_code=?, category=?, product_name=?, description=?, retail_price=?, minimum_stock=?
      WHERE id=?
    `;

    values = [
      product_code,
      normalizedCategory,
      product_name,
      description,
      retail_price,
      minimum_stock,
      id
    ];
  }

  db.query(sql, values, (err) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to update product" });
    }

    res.json({ message: "Product updated successfully" });
  });
};
