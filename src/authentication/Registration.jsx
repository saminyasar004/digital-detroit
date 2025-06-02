import { useState } from 'react';
import { Mail, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Register from '../assets/register.png';
import axiosInstance from '../component/axiosInstance';

export default function RegistrationPage() {
	const [formData, setFormData] = useState({
		email: '',
		phone: '',
		role: 'user', // Added role field
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false); // Added loading state
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(null); // Clear error on input change
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // Clear previous errors
		setIsLoading(true); // Set loading state

		// Client-side validation
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		if (
			!formData.email ||
			!formData.phone ||
			!formData.role ||
			!formData.password
		) {
			setError('Please fill in all fields');
			setIsLoading(false);
			return;
		}

		try {
			const response = await axiosInstance.post('/register/', {
				email: formData.email,
				phone_number: formData.phone,
				role: formData.role,
				password: formData.password,
			});

			console.log('Registration successful:', response.data);

			if (response.status === 201) {
				navigate('/login'); // Redirect to login page after successful registration
			} else {
				setError('Registration failed. Please try again.');
			}
		} catch (error) {
			if (error.response) {
				// Handle API errors
				console.log('Error response:', error.response.data);
				const serverError =
					error.response.data.error ||
					error.response.data.email ||
					'Registration failed. Please try again.';
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

			{/* Right side - Form */}
			<div className="w-full md:w-1/2 flex items-center justify-center p-8">
				<div className="w-full max-w-md space-y-8">
					<div className="text-center flex items-center justify-center flex-col">
						<img src={Logo} alt="" className="w-44 h-28 my-5" />
						<h1 className="text-3xl font-bold text-blue-950">
							Create your account
						</h1>
					</div>

					{/* Display error message if any */}
					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					<form onSubmit={handleSubmit} className="mt-8 space-y-6">
						<div className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1">
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
										value={formData.email}
										onChange={handleChange}
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-gray-700 mb-1">
									Phone number
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Phone className="h-5 w-5 text-gray-400" />
									</div>
									<Input
										id="phone"
										name="phone"
										type="tel"
										placeholder="3546 53541645"
										className="pl-10"
										value={formData.phone}
										onChange={handleChange}
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="Password"
										className="pl-10"
										value={formData.password}
										onChange={handleChange}
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700 mb-1">
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										placeholder="Confirm Password"
										className="pl-10"
										value={formData.confirmPassword}
										onChange={handleChange}
										required
										disabled={isLoading}
									/>
								</div>
							</div>
						</div>

						<div>
							<Button
								type="submit"
								className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
								disabled={isLoading}>
								{isLoading ? 'Registering...' : 'Register'}
							</Button>
						</div>
					</form>

					<div className="text-center mt-4">
						<p className="text-sm text-gray-600">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-blue-500 hover:text-blue-700 font-medium">
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
