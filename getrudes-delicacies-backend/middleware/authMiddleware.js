// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if the user is authenticated
const protect = async (req, res, next) => {
	let token;

	// Check if token exists in the authorization header
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			// Get token from header
			token = req.headers.authorization.split(' ')[1];
			console.log('Token received:', token); // debugging

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from token and attach it to req.user
			req.user = await User.findById(decoded.id).select('-password');    // Exclude password

			// Proceed to the next middleware
			next();
		} catch (error) {
			console.error('Token verification failed:', error);
			res.status(401).json({ message: 'Not authorized, token failed' });
		}
	}

	if (!token) {
		res.status(401).json({ message: 'Not authorized, no token' });
	}
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		res.status(403).json({ message: 'Not authorized as admin' });
	}
};

module.exports = { protect, admin };
