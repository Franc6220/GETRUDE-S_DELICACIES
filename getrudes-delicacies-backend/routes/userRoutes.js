// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');


// Register user
router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// Check if user already exists
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ mesaage: 'User already exists' });
		}

		// Create a new user
		user = await User.create({
			name,
			email,
			password,     // Password will be hashed by the `userModel` pre-save hook
		});

		// Generate a JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
			expiresIn: '30d' 
		});

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Login user
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ email });

		if (user && (await user.matchPassword(password))) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: '30d'
			});

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token,
		});
	} else {
		res.status(401).json({ message: 'Invalid email or password' });
	}
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Protected route - Get user profile
router.get('/profile', protect, async (req, res) => {
	try {
		// Send back user data (without password)
		res.json({
			_id: req.user._id,
			name: req.user.name,
			email: req.user.email,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
