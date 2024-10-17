// src/components/ForgotPassword.js
import React, { useState } from 'react';
import api from '../api/api';  // Axios instance

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post('/users/forgotpassword', { email });
			setMessage('Password reset link has been sent to your email.');
		} catch (err) {
			setError('Failed to send reset link. Please try again.')
		}
	};

	return (
		<div>
			<h2>Forgot Password</h2>
			<form onSubmit={handleSubmit}>
				<input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<button type="submit">Send Reset Link</button>
			</form>
			{message && <p>{message}</p>}
			{error && <p>{error}</p>}
		</div>
	);
};

export default ForgotPassword;
