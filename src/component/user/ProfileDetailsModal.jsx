import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axiosInstance from '../axiosInstance';

export default function ProfileDetailsModal({
	isOpen,
	onClose,
	fetchUserProfile,
}) {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		profession: '',
		email: '',
	});
	// const [photoName, setPhotoName] = useState(null); // Display file name
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);

	// Fetch user profile data when modal opens
	useEffect(() => {
		if (!isOpen) return;

		const fetchProfile = async () => {
			setFetching(true);
			setError('');

			try {
				const response = await axiosInstance.get('/profile/');

				const profileData = response.data;

				setFormData({
					name: profileData.name || profileData.username || '',
					phone: profileData.phone_number || '',
					profession: profileData.Profession || '',
					email: profileData.user.email || '',
				});
			} catch (err) {
				setError(err.response?.data?.error || 'Failed to fetch profile data.');
				if (err.response?.status === 401) {
					window.location.href = '/login'; // Redirect to login
				}
			} finally {
				setFetching(false);
			}
		};

		fetchProfile();
	}, [isOpen]);

	// Handle input changes
	const handleChange = (e) => {
		const { id, value, files } = e.target;
		if (id === 'image') {
			const file = files[0];
			setFormData((prev) => ({ ...prev, image: file }));
		} else {
			setFormData((prev) => ({ ...prev, [id]: value }));
		}
		setError('');
	};

	// Handle photo deletion
	const handlePhotoDelete = () => {
		setFormData((prev) => ({ ...prev, image: null }));
		setPhotoName(null);
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Validation
		if (!formData.name || !formData.email) {
			setError('Name and email are required.');
			setLoading(false);
			return;
		}

		// Prepare form data for multipart upload
		const formDataToSend = new FormData();
		formDataToSend.append('name', formData.name);
		formDataToSend.append('phone_number', formData.phone);
		formDataToSend.append('Profession', formData.profession);

		try {
			await axiosInstance.put('/profile/', formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data', // Required for file upload
				},
			});

			alert('Profile updated successfully:');
			fetchUserProfile();
			onClose(); // Close modal on success
		} catch (err) {
			setError(
				err.response?.data?.error ||
					'Failed to update profile. Please try again.'
			);
			if (err.response?.status === 401) {
				localStorage.removeItem('token');
				window.location.href = '/login';
			}
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md p-0 border border-blue-100 rounded-lg overflow-hidden">
				<div className="bg-white p-6 w-full">
					<div className="mb-6">
						<button
							className="flex items-center text-gray-700"
							onClick={onClose}
							disabled={loading || fetching}>
							<ArrowLeft className="h-5 w-5 mr-1" />
							<span>Back</span>
						</button>
					</div>

					<h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
						Profile Details
					</h1>

					{error && (
						<p className="text-red-500 text-sm text-center mb-4">{error}</p>
					)}

					{fetching ? (
						<p className="text-center text-gray-600">Loading profile...</p>
					) : (
						<form className="space-y-5" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="name" className="text-gray-600">
									Name of the user
								</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={handleChange}
									className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
									disabled={loading}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone" className="text-gray-600">
									Phone number
								</Label>
								<Input
									id="phone"
									value={formData.phone}
									onChange={handleChange}
									className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
									disabled={loading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="profession" className="text-gray-600">
									Profession
								</Label>
								<Input
									id="profession"
									value={formData.profession}
									onChange={handleChange}
									placeholder="Enter here"
									className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
									disabled={loading}
								/>
							</div>

							{/* <div className="space-y-2">
								<Label className="text-gray-600">Upload your photo</Label>
								<div className="flex items-center gap-3">
									{photoName ? (
										<div className="flex items-center bg-blue-50 rounded-md px-3 py-2">
											<ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
											<span className="text-sm text-gray-600">{photoName}</span>
										</div>
									) : (
										<Button
											variant="outline"
											className="h-10 px-3 text-sm border-gray-200"
											disabled={loading}
											as="label">
											<input
												id="image"
												type="file"
												accept="image/*"
												onChange={handleChange}
												className="hidden"
												disabled={loading}
											/>
											Choose file
										</Button>
									)}

									{photoName && (
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-red-500"
											onClick={handlePhotoDelete}
											disabled={loading}>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							</div> */}

							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-600">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									readOnly
									className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
									disabled={loading}
									required
								/>
							</div>

							<div className="pt-4">
								<Button
									type="submit"
									className="w-full bg-blue-500 hover:bg-blue-600 text-white"
									disabled={loading || fetching}>
									{loading ? 'Submitting...' : 'Submit'}
								</Button>
							</div>
						</form>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
