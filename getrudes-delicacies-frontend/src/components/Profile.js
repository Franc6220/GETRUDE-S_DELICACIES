// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import api from '../api/api';  // Axios instance

const Profile = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	// Fetch the user's current profile info when the component loads
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const { data } = await api.get('/users/profile');
				setName(data.name);
				setEmail(data.email);
			} catch (error) {
				setMessage('Failed to load profile');
			}
		};
		fetchProfile();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.put('/users/profile', { name, email, password });
			setMessage('Profile updated successfully');
		} catch (error) {
			setMessage(error.response?.data?.message || 'Profile update failed');
		}
	};

	return (
		<div>
			<h2>Your Profile</h2>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Name" value={name} onChange={(e) =>setName(e.target.value)} />
				<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" placeholder="New Password (optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Update Profile</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default Profile;
