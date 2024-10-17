// src/components/ResetPassword.js
import React, { useState } from 'react';
import api from '../api/api';  // Axios instance
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
	const { token } = useParams();  // Get token from URL
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.put(`/users/resetpassword/${token}`, { password });
			setMessage('Password reset successfully. You can now log in with your new password.');
		} catch (error) {
			setMessage(error.response?.data?.message || 'Error resetting password');
		}
	};

	return (
		<div>
			<h2>Reset Password</h2>
			<form onSubmit={handlesubmit}>
				<input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Reset Password</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default ResetPassword;
