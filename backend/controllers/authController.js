const db = require("../db");
const { USERNAME_PATTERN } = require("../utils/validation");

exports.signin = (req, res) => {
  const { username, password } = req.body;

  if (!USERNAME_PATTERN.test(username || "") || typeof password !== "string" || password.length < 6 || password.length > 72) {
    return res.status(400).json({ message: "Invalid username or password format" });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  const values = [username, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (result.length > 0) {
      const user = result[0];

      if (user.status === "inactive") {
        return res.status(403).json({
          message: "This account has been deactivated.",
        });
      }

      if (user.status !== "approved") {
        return res.status(403).json({
          message: "Your account is still pending admin approval.",
        });
      }

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
};

exports.signup = (req, res) => {
  const { username, password, role } = req.body;

  if (!USERNAME_PATTERN.test(username || "")) {
    return res.status(400).json({ message: "Username must use only letters, numbers, or underscores" });
  }

  if (typeof password !== "string" || password.length < 6 || password.length > 72) {
    return res.status(400).json({ message: "Password must be 6-72 characters" });
  }

  if (role && !["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const sql =
    "INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)";
  const normalizedRole = role || "user";
  const initialStatus = normalizedRole === "admin" ? "approved" : "pending";
  const values = [username, password, normalizedRole, initialStatus];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Signup failed" });
    }

    res.json({ success: true, message: "User registered successfully" });
  });
};
