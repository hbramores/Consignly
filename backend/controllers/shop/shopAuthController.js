//shopAuthController.js
const db = require("../../db");
const { CODE_PATTERN } = require("../../utils/validation");

exports.shopLogin = (req, res) => {
  const { access_code } = req.body;

  if (!CODE_PATTERN.test(access_code || "")) {
    return res.status(400).json({ message: "Invalid shop access code format" });
  }

  const sql = `
    SELECT 
      id, 
      shop_name, 
      commission_rate, 
      contract_type,
      access_code, 
      shop_link, 
      status
    FROM shops
    WHERE access_code = ? AND status = 'active'
  `;

  db.query(sql, [access_code], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Shop login failed" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid shop access code" });
    }

    res.json({
      success: true,
      message: "Shop login successful",
      shop: result[0],
    });
  });
};
