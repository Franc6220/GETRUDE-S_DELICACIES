// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

// Import user routes
const userRoutes = require('./routes/userRoutes');
app.use('./api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
	res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
