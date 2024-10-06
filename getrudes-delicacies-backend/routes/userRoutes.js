// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// Check if user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ mesaage: 'User already exists' });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		user = new User({
			name,
			email,
			password: hashedPassword
		});

		await user.save();

		// Generate a JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.status(201).json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
});

// Login user
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Generate a JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
