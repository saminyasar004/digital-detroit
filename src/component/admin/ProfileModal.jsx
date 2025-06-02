import { useState, useEffect } from 'react';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import axiosInstance from '../axiosInstance';

const ProfileModal = ({ isOpen, onClose }) => {
	console.log(onclose);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		new_Password: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch profile data when modal opens
	useEffect(() => {
		if (!isOpen) return;

		const fetchProfile = async () => {
			try {
				setLoading(true);
				const response = await axiosInstance.get('/profile/');
				const profile = response.data;
				setFormData({
					name: profile.name || '',
					email: profile.user.email || '',
					password: '',
					new_Password: '',
				});
				setError(null);
			} catch (err) {
				console.error('Error fetching profile:', err);
				setError('Failed to load profile data.');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [isOpen]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password && formData.password !== formData.new_Password) {
			alert('Passwords do not match!');
			return;
		}

		try {
			setLoading(true);
			// Update profile
			const profileData = {
				name: formData.name,
			};
			await axiosInstance.put('/api/profile/', profileData);

			// Update password if provided
			if (formData.password) {
				await axiosInstance.post('/api/change-password/', {
					new_password: formData.new_Password,
					current_password: formData.password,
				});
			}

			console.log('Profile updated:', formData);
			onClose();
		} catch (err) {
			console.error('Error updating profile:', err);
			alert('Failed to update profile.');
		} finally {
			setLoading(false);
		}
	};

	// Export profile to DOCX

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
					<FiX size={20} />
				</button>

				{/* Header */}
				<div className="flex items-center mb-6 justify-between">
					<button
						onClick={onClose}
						className="text-blue-600 hover:text-blue-700 flex items-center">
						<FiArrowLeft className="mr-2" />
						Back
					</button>
					<h2 className="text-xl font-semibold text-gray-800">
						Profile Details
					</h2>
					<h2></h2>
				</div>

				{/* Error and Loading States */}
				{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
				{loading && (
					<div className="text-gray-600 text-sm mb-4">Loading...</div>
				)}

				{/* Form */}
				{!loading && (
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Name */}
						<div>
							<label className="block text-sm text-gray-600 mb-1">Name</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm text-gray-600 mb-1">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								readOnly
								placeholder="Enter here"
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Current Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Enter new password"
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm text-gray-600 mb-1">
								New Password
							</label>
							<input
								type="password"
								name="new_Password"
								value={formData.new_Password}
								onChange={handleInputChange}
								placeholder="Confirm new password"
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Export to DOCX Button */}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className={`w-full py-3 bg-blue-600 text-white rounded-lg transition-colors ${
								loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
							}`}>
							{loading ? 'Submitting...' : 'SUBMIT'}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default ProfileModal;
