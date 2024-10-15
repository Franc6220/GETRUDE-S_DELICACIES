// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],   // Role can either be 'user' or 'admin'
			default: 'user',           // Default role is 'user'
		},
		resetPasswordToken: String,      // Added for password reset token
		resetPasswordExpire: Date,       // Added for token expiration
		isVerified: {
			type: Boolean,
			default: false,          // Set to false initially
		},
		verification: {                   // New: Store email verification token
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Add method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
