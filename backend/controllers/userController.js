const db = require("../db");

exports.getUsers = (req, res) => {
  const sql = "SELECT id, username, role, status, created_at FROM users ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }

    res.json(result);
  });
};

exports.deactivateUser = (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE users SET status = 'inactive' WHERE id = ? AND role != 'admin'";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to deactivate user" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot deactivate admin user" });
    }

    res.json({ message: "User deactivated successfully" });
  });
};

exports.approveUser = (req, res) => {
  const { id } = req.params;

  const sql =
    "UPDATE users SET status = 'approved' WHERE id = ? AND role != 'admin'";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Failed to approve user" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot approve this user" });
    }

    res.json({ message: "User approved successfully" });
  });
};
