// src/components/ResetPassword.js
import React, { useState } from 'react';
import api from '../api/api';  // Axios instance
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
	const { token } = useParams();  // Get token from URL
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');  // For confirming password
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if passwords match before making the API request
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
			return;
		}

		try {
			// Send the password reset request with the token
			await api.put(`/users/resetpassword/${token}`, { password });
			setMessage('Password reset successfully. You can now log in with your new password.');
		} catch (err) {
			setMessage(err.response?.data?.message || 'Error resetting password');
		}
	};

	return (
		<div>
			<h2>Reset Password</h2>
			<form onSubmit={handleSubmit}>
				<input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				<button type="submit">Reset Password</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default ResetPassword;
