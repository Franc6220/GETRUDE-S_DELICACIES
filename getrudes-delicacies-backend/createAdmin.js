// createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel'); // Adjust the path to your user model

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => { 
	console.log('MongoDB connected');

	// Create the admin user
	return User.create({
		name: 'Admin User',
		email: 'neewadmin@example.com',
		password: 'adminpassword',
		role: 'admin',
	});
}).then(() => {
	console.log('Admin user created successfully');
	mongoose.disconnect();   // Disconnect after the user is created
}).catch((err) => {
	console.error('Error creating admin user:', err);
	mongoose.disconnect();
});
