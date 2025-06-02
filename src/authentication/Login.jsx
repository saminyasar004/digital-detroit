import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Register from '../assets/register.png';
import axiosInstance from '../component/axiosInstance';
import { useAuth } from '../component/AuthContext';

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState(''); // State to handle errors
	const [loading, setLoading] = useState(false); // State to handle loading
	const navigate = useNavigate(); // For redirecting after successful login
	const { login } = useAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(''); // Clear error on input change
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Set loading state
		setError(''); // Clear previous errors

		try {
			// Make API call to the login endpoint
			const response = await axiosInstance.post('/login/', {
				email: formData.email,
				password: formData.password,
			});
			const data = response.data;

			login(data.access_token, formData.email);
			localStorage.setItem('role', response.data.profile.user.role);

			if (response.data.profile.user.role === 'user') {
				navigate('/chat');
			} else {
				navigate('/dashboard');
			}
		} catch (err) {
			// Handle errors
			setLoading(false);
			if (err.response) {
				// API returned an error response
				setError(
					err.response.data.message ||
						'Invalid email or password. Please try again.'
				);
			} else {
				// Network or other errors
				setError('Something went wrong. Please try again later.');
			}
		} finally {
			setLoading(false); // Reset loading state
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
							Welcome to Digital
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
										disabled={loading}
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
										disabled={loading}
									/>
								</div>
								<div className="flex justify-end items-end">
									<Link
										to={'/forget-password'}
										className="text-sm text-blue-500 hover:text-blue-700 font-medium mt-2">
										Forget Password?
									</Link>
								</div>
							</div>
						</div>

						<div>
							<Button
								type="submit"
								className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
								disabled={loading}>
								{loading ? 'Logging in...' : 'Login'}
							</Button>
						</div>
					</form>

					<div className="text-center mt-4">
						<p className="text-sm text-gray-600">
							Don’t have an account?{' '}
							<Link
								to="/signup"
								className="text-blue-500 hover:text-blue-700 font-medium">
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
