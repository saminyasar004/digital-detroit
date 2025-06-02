import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import Register from '../assets/register.png';
import axiosInstance from '../component/axiosInstance';

export default function EmailConfirmation() {
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setEmail(e.target.value);
		setError(null); // Clear error on input change
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // Clear previous errors
		setIsLoading(true); // Set loading state

		if (!email) {
			setError('Please enter an email address');
			setIsLoading(false);
			return;
		}

		try {
			const response = await axiosInstance.post('/otp/create/', {
				email,
			});

			console.log('OTP sent successfully:', response.data);

			if (response.status === 200 || response.status === 201) {
				// Redirect to OTP verification page, passing email as state
				navigate('/otp-verification', { state: { email } });
			} else {
				setError('Failed to send OTP. Please try again.');
			}
		} catch (error) {
			if (error.response) {
				// Handle API errors
				console.log('Error response:', error.response.data);
				const serverError =
					error.response.data.error || 'Failed to send OTP. Please try again.';
				setError(serverError);
			} else {
				// Handle network or other errors
				console.log('Error without response:', error.message);
				setError('Network error. Please try again.');
			}
		} finally {
			setIsLoading(false); // Reset loading state
		}
	};

	return (
		<div className="flex items-center md:justify-between justify-center min-h-screen md:px-5">
			<div className="w-1/2 h-[95vh] md:block hidden relative rounded-md overflow-hidden">
				<img
					src={Register}
					alt="AI robot reading a book"
					className="w-full h-full object-cover rounded-md"
				/>
			</div>

			<div className="flex flex-col w-full md:w-1/2 p-8 md:p-12 justify-center items-center">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
						{/* Back button */}
						<Link
							to="/login" // Adjust the route as needed
							className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Link>

						{/* Form heading */}
						<h1 className="text-2xl font-medium text-center mb-8">
							Confirm Email
						</h1>

						{/* Display error message if any */}
						{error && (
							<div className="text-red-500 text-sm text-center mb-4">
								{error}
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Mail className="h-5 w-5 text-gray-400" />
										</div>
										<Input
											id="email"
											name="email"
											type="email"
											placeholder="user@mail.com"
											className="pl-10"
											value={email}
											onChange={handleChange}
											required
											disabled={isLoading}
										/>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full bg-[#1e88c9] hover:bg-[#1a78b3] text-white"
									disabled={isLoading}>
									{isLoading ? 'Sending OTP...' : 'Confirm'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
