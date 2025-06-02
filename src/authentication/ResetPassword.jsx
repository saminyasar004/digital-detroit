import React, { useState } from 'react';
import Black from '../assets/register.png';
import { MdLockOutline, MdArrowBack } from 'react-icons/md';
import { GoCheckCircleFill } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '../component/axiosInstance';

const ResetPassword = () => {
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: '',
	});
	const [passwordSuccessful, setPasswordSuccessful] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { state } = useLocation();
	const email = state?.email || ''; // Get email from OtpVerification

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		setError(''); // Clear error on input change
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Validation
		if (!formData.password || !formData.confirmPassword) {
			setError('Please fill in all fields');
			setLoading(false);
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			setLoading(false);
			return;
		}
		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters long');
			setLoading(false);
			return;
		}
		if (!email) {
			setError('Email not found. Please start the reset process again.');
			setLoading(false);
			return;
		}

		try {
			const response = await axiosInstance.post('/password-reset/confirm/', {
				email,
				new_password: formData.password,
			});

			console.log('Password reset successful:', response.data);
			setPasswordSuccessful(true);
			setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
		} catch (err) {
			setError(
				err.response?.data?.error ||
					'Failed to reset password. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center md:justify-between justify-center min-h-screen md:px-5">
			<div className="w-1/2 h-[95vh] md:block hidden relative rounded-md overflow-hidden">
				<img
					src={Black}
					alt="AI robot reading a book"
					className="w-full h-full object-cover rounded-md"
				/>
			</div>
			<div className="md:w-1/2 flex items-center justify-center">
				<div className="md:w-[60%] p-8 space-y-8 rounded-lg">
					{passwordSuccessful ? (
						<div className="space-y-4 bg-white rounded-md shadow-lg flex flex-col items-center justify-center p-10">
							<GoCheckCircleFill size={30} color="#1E5DCC" />
							<p className="text-[20px] text-gray-700">
								Password changed successfully
							</p>
							<Link
								to="/login"
								className="px-3 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white text-sm font-bold">
								<MdArrowBack size={20} />
								Back To Login
							</Link>
						</div>
					) : (
						<div className="bg-white rounded-md shadow-lg p-10">
							{/* Back button */}
							<Link
								to="/login"
								className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
								<MdArrowBack size={20} className="mr-2" />
								Back
							</Link>

							<h2 className="text-[20px] text-center mb-6 text-gray-700">
								Reset Your Password
							</h2>

							{error && (
								<p className="text-red-500 text-center text-sm mb-4">{error}</p>
							)}

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="flex flex-col gap-1">
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700">
										New Password
									</label>
									<div className="relative">
										<MdLockOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
										<Input
											type="password"
											id="password"
											value={formData.password}
											onChange={handleChange}
											placeholder="Enter new password"
											className="pl-10"
											required
											disabled={loading}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium text-gray-700">
										Confirm Password
									</label>
									<div className="relative">
										<MdLockOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
										<Input
											type="password"
											id="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											placeholder="Confirm new password"
											className="pl-10"
											required
											disabled={loading}
										/>
									</div>
								</div>
								<div className="w-full flex items-center justify-center">
									<Button
										type="submit"
										disabled={loading}
										className={`w-full md:w-[30%] bg-blue-500 text-white text-sm font-bold ${
											loading
												? 'opacity-50 cursor-not-allowed'
												: 'hover:bg-blue-700'
										}`}>
										{loading ? 'Resetting...' : 'Confirm'}
									</Button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
