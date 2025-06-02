import React, { useState, useRef } from 'react';
import Black from '../assets/register.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';
import { FaArrowLeft } from 'react-icons/fa6';

const OtpVerification = () => {
	const [code, setCode] = useState(new Array(4).fill(''));
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { state } = useLocation();
	const email = state?.email || ''; // Get email from previous page (EmailConfirmation)

	const inputRefs = useRef([]);

	// Handle OTP input changes
	const handleChange = (element, index) => {
		if (isNaN(element.value)) return;

		const newCode = [...code];
		newCode[index] = element.value;
		setCode(newCode);

		if (element.value && index < 3) {
			inputRefs.current[index + 1].focus();
		}
	};

	// Handle paste event
	const handlePaste = (e) => {
		const pastedData = e.clipboardData.getData('text').trim();
		if (pastedData.length === 4 && !isNaN(pastedData)) {
			const newCode = pastedData.split('');
			setCode(newCode);
			inputRefs.current[3].focus();
			e.preventDefault();
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		const otp = code.join('');
		if (otp.length !== 4) {
			setError('Please enter a 4-digit code');
			setLoading(false);
			return;
		}

		if (!email) {
			setError('Email not found. Please start the reset process again.');
			setLoading(false);
			return;
		}

		try {
			const response = await axiosInstance.post('/otp/verify/', {
				email,
				otp,
			});

			console.log('OTP verified:', response.data);

			if (response.status === 200) {
				// Redirect to password reset page
				navigate('/password-reset/confirm', { state: { email } });
			}
		} catch (err) {
			setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	// Handle resend OTP
	const handleResend = async () => {
		if (!email) {
			setError('Email not found. Please start the reset process again.');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/otp/create/', { email });
			setError('New OTP sent to your email');
			setCode(new Array(4).fill('')); // Clear OTP inputs
		} catch (err) {
			setError(
				err.response?.data?.error || 'Failed to resend OTP. Please try again.'
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
					<div className="w-full p-8 text-t_color rounded-lg shadow-lg">
						{/* Back button */}
						<Link
							to="/email-confirmation" // Adjust the route as needed
							className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
							<FaArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Link>

						<h2 className="text-[20px] text-center mb-6">
							We have sent you an activation code
						</h2>
						<p className="text-[12px] text-center mb-5">
							An email has been sent to your email address containing a code to
							reset your password.
						</p>

						{error && (
							<p
								className={`text-center text-sm mb-4 ${
									error.includes('sent') ? 'text-green-500' : 'text-red-500'
								}`}>
								{error}
							</p>
						)}

						<p className="text-[16px] py-5 text-center">
							Enter verification code
						</p>
						<form onSubmit={handleSubmit}>
							<div className="flex justify-center space-x-2 mb-8">
								{code.map((digit, index) => (
									<input
										key={index}
										type="text"
										name="code"
										maxLength="1"
										value={digit}
										onChange={(e) => handleChange(e.target, index)}
										onPaste={index === 0 ? handlePaste : null}
										onKeyUp={(e) => {
											if (e.key === 'Backspace' && !digit && index > 0) {
												inputRefs.current[index - 1].focus();
											}
										}}
										ref={(el) => (inputRefs.current[index] = el)}
										className="w-12 h-12 bg-gray-100 rounded text-center text-lg font-bold border border-gray-100 focus:border-blue-500"
										onFocus={(e) => e.target.select()}
										required
										disabled={loading}
									/>
								))}
							</div>
							<div className="w-full flex items-center justify-center">
								<button
									type="submit"
									disabled={loading}
									className={`md:w-[30%] flex items-center justify-center py-3 px-3 bg-blue-500 rounded text-white text-sm font-bold ${
										loading
											? 'opacity-50 cursor-not-allowed'
											: 'hover:bg-blue-700'
									}`}>
									{loading ? 'Verifying...' : 'Confirm'}
								</button>
							</div>
						</form>
						<p
							onClick={!loading ? handleResend : null}
							className={`text-center text-sm text-t_color mt-6 ${
								loading
									? 'cursor-not-allowed'
									: 'hover:text-blue-600 cursor-pointer'
							}`}>
							If you didn't receive a code, click here to resend...
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OtpVerification;
