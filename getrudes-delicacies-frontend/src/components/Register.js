import React, { useState } from 'react';
import api from '../api/api';  // Axios instance

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await api.post('/users/register', { name, email, password });
			setMessage('User registered successfully. Please check your email to verify your account.');
		} catch (error) {
			setMessage(error.response.data.message || 'Registration failed');
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
