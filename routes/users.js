const express = require("express");
const router = express.Router();
const connection = require("../config/db");
const { body, validationResult } = require("express-validator");

// Get all users
router.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }
    res.json({ success: true, users: results });
  });
});

// Add a new user with validation
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email } = req.body;
    connection.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err });
      }
      res.json({ success: true, message: "User added successfully", userId: result.insertId });
    });
  }
);

// Update a user
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email } = req.body;
    const { id } = req.params;

    connection.query("UPDATE users SET name=?, email=? WHERE id=?", [name, email, id], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, message: "User updated successfully" });
    });
  }
);

// Delete a user
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  connection.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  });
});

module.exports = router;
