// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	const token = req.header('Authorization');

	// Check if there's no token
	if (!token) {
		return res.status(401).json({ message: 'No token, authorization denied' });
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.id;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
}

module.exports = auth;
