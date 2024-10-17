// src/components/Login.js
import React, { useState } from 'react';
import api from '../api/api';  // Axios instance for API calls
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post('/users/login', { email, password });
			console.log('Login successful:', res.data);
			navigate('/profile');         // Redirect to profile after successful login
		} catch (err) {
			setError('Login failed. Please check your credentials.');
			console.error('Login error:', err);
		}
	};

	return (
		<div>
			<h1>Login</h1>
			{error && <p>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
