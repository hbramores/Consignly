const express = require("express");
const router = express.Router();

const {
  getUsers,
  deactivateUser,
  approveUser,
} = require("../controllers/userController");

router.get("/users", getUsers);

router.delete("/users/:id", deactivateUser);

router.put("/users/:id/approve", approveUser);

module.exports = router;
