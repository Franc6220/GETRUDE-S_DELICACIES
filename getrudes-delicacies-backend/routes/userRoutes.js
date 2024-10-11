// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // To generate random tokens
const nodemailer = require('nodemailer'); // For sending reset email
const { protect, admin } = require('../middleware/authMiddleware');


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
		const user = await User.create({
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

// --- New Features Start Here ---

// Admin-only route
router.get('/admin', protect, admin, (req, res) => {
	res.json({ message: 'Welcome, Admin!' });
});

// View order history (protected route)
router.get('/orders', protect, (req, res) => {
	// Simulated order history (replace this with actual order logic later)
	const orders = [
		{ orderId: '001', product: 'English breakfast', price: 1800 },
		{ orderId: '002', product: '3 slices of tea cake and milk tea', price: 500 },
	];

	res.json({ user: req.user.name, orders });
});

// Update user profile (protected route)
router.put('/profile', protect, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();
			res.json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
			});
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Request password reset (sends email)
router.post('/forgotpassword', async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: 'User not found' });

		// Generrate reset token
		const resetToken = crypto.randomBytes(32).toString('hex');
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;   // Expires in 10 minutes
		await user.save();

		// Log environment variables to check if they are set
		console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
		console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
		console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
		});

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: user.email,
			subject: 'Password Reset Request',
			text: `Click the following link to reset your password: \n\n http://localhost:5000/api/users/resetpassword/${resetToken}`,
		};

		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: 'Password reset email sent' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Reset password (using reset token)
router.put('/resetpassword/:resetToken', async (req, res) => {
	const { password } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: req.params.resetToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();
		res.status(200).json({ message: 'Password successfully rreset' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
