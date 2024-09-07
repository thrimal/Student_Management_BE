const express = require("express");
const User = require("../entities/userEntity");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const authenticateToken = require('../middleware/jwt');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  try {
    const { user_id, name, email, password, role } = req.body;

    if (user_id === null || user_id === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found userId", data: null });
      return;
    } else if (name === null || name === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found name", data: null });
      return;
    } else if (email === null || email === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found email", data: null });
      return;
    }else if (password === null || password === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found password", data: null });
      return;
    }  else if (role === null || role === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found role", data: null });
      return;
    }

    let userId = parseInt(user_id);
    let hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({ where: { user_id: userId } });

    if (user) {
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        hasError: false,
        message: "User updated successfully",
        data: user,
      });
    } else {
      const newUser = await User.create({
        user_id: userId,
        name: name,
        email: email,
        password: hashedPassword,
        role: role
      });
      res.status(201).json({
        hasError: false,
        message: "User created successfully",
        data: newUser,
      });
    }
  } catch (error) {
    console.log("Error processing request:", error);
    res.status(500).json({ hasError: true, message: "Server error", data: null });
  }
}); 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ hasError: true, message: "User not found", data: null });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ hasError: true, message: "Invalid credentials", data: null });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role }, // Payload
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      hasError: false,
      message: "Login successful",
      token,
      data: { user_id: user.user_id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ hasError: true, message: "Login failed", data: null });
  }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json({
        hasError: false,
        message: 'User retrieved successfully',
        data: users
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({
        hasError: true,
        message: 'Failed to retrieve users',
        data: null
      });
    }
  });

  router.delete('/:user_id',authenticateToken, async (req, res) => {
    try { 
      const { user_id } = req.params;
      const userId = parseInt(user_id);
  
      const user = await User.findByPk(userId);
  
      if (user) {
        await user.destroy();
        res.status(200).json({
          hasError: false,
          message: 'User deleted successfully',
          data: null
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: 'User not found',
          data: null
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        hasError: true,
        message: 'Failed to delete user',
        data: null
      });
    }
  });

  router.get("/:user_id",authenticateToken, async (req, res) => {
    try {
      const { user_id } = req.params;
      const userId = parseInt(user_id);
  
      const user = await User.findByPk(userId);
  
      if (user) {
        res.status(200).json({
          hasError: false,
          message: "User found",
          data: user,
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "User not found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({
        hasError: true,
        message: "Failed to find user",
        data: null,
      });
    }
  });

module.exports = router;

