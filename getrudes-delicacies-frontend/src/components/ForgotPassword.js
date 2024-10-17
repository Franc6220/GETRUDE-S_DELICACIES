// src/components/ForgotPassword.js
import React, { useState } from 'react';
import api from '../api/api';  // Axios instance

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post('/users/forgotpassword', { email });
			setMessage('Password reset email sent. Please check your inbox.');
		} catch (error) {
			setMessage(error.response?.data?.message || 'Error sending password reset email');
		}
	};

	return (
		<div>
			<h2>Forgot Password</h2>
			<form onSubmit={handleSubmit}>
				<input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<button type="submit">Submit</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default ForgotPassword;
