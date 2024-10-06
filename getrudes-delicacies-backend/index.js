// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Verify the environment variables (for debugging purposes)
console.log("MONGO_URI: ", process.env.MONGO_URI);
console.log("JWT_SECRET: ", process.env.JWT_SECRET);

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

// Basic route
app.get('/', (req, res) => {
	res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
