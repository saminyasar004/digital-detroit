import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import axiosInstance from '../axiosInstance';

export default function ChangePasswordModal({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		setError('');
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Validation
		if (
			!formData.currentPassword ||
			!formData.newPassword ||
			!formData.confirmNewPassword
		) {
			setError('Please fill in all fields');
			setLoading(false);
			return;
		}
		if (formData.newPassword !== formData.confirmNewPassword) {
			setError('New passwords do not match');
			setLoading(false);
			return;
		}
		if (formData.newPassword.length < 8) {
			setError('New password must be at least 8 characters long');
			setLoading(false);
			return;
		}

		try {
			const response = await axiosInstance.post('/password-change/', {
				current_password: formData.currentPassword,
				new_password: formData.newPassword,
			});

			if (response.status === 200) {
				alert('Password changed successfully');
				onClose(); // Close modal on success
			}
		} catch (err) {
			setError(
				err.response?.data?.error ||
					'Failed to change password. Please try again.'
			);
			if (err.response?.status === 401) {
				localStorage.removeItem('token');
				window.location.href = '/login'; // Redirect to login
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bg-white">
				<div className="mb-2">
					<button
						className="flex items-center text-gray-700"
						onClick={onClose}
						disabled={loading}>
						<ArrowLeft className="h-5 w-5 mr-1" />
						<span>Back</span>
					</button>
				</div>

				<DialogHeader className="mb-6">
					<DialogTitle className="text-center text-2xl font-semibold">
						Change Password
					</DialogTitle>
				</DialogHeader>

				{error && (
					<p className="text-red-500 text-sm text-center mb-4">{error}</p>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label
							htmlFor="currentPassword"
							className="block text-sm font-medium">
							Current Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</div>
							<Input
								id="currentPassword"
								type="password"
								placeholder="Enter current password"
								value={formData.currentPassword}
								onChange={handleChange}
								className="pl-10"
								disabled={loading}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="newPassword" className="block text-sm font-medium">
							New Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</div>
							<Input
								id="newPassword"
								type="password"
								placeholder="Enter new password"
								value={formData.newPassword}
								onChange={handleChange}
								className="pl-10"
								disabled={loading}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="confirmNewPassword"
							className="block text-sm font-medium">
							Confirm New Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</div>
							<Input
								id="confirmNewPassword"
								type="password"
								placeholder="Confirm new password"
								value={formData.confirmNewPassword}
								onChange={handleChange}
								className="pl-10"
								disabled={loading}
								required
							/>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white"
						disabled={loading}>
						{loading ? 'Changing...' : 'Continue'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
