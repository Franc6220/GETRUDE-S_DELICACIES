import React, { useState } from 'react';
import api from '../api/api';  // Axios instance
import { useNavigate } from 'react-router-dom';  // For redirection

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await api.post('/users/register', { name, email, password });
			setMessage('User registered successfully. Please check your email to verify your account.');

			// Redirect to login page after successful registration
			setTimeout(() => {
				navigate('/login');
			}, 2000);  // Redirect after 2 seconds (optional)

		} catch (error) {
			setMessage(error.response?.data?.message || 'Registration failed');
		}
	};

	return (
		<div>
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Register</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default Register;
