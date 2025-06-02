import { FiArrowLeft, FiX } from 'react-icons/fi';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
	if (!isOpen || !user) return null; // Return null if modal is closed or no user? is provided

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
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={onClose}
						className="text-blue-600 hover:text-blue-700 flex items-center">
						<FiArrowLeft className="mr-2" />
						Back
					</button>
					<h2 className="text-xl font-semibold text-gray-800">User Details</h2>
					<div></div>
				</div>

				{/* Profile Image */}
				<div className="w-full flex items-center justify-center mb-6">
					<img
						src={
							user?.profileImage || // Use user?.profileImage if available
							'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg'
						}
						alt={user?.name}
						className="h-20 w-20 object-cover border rounded-full"
					/>
				</div>

				{/* User? Details */}
				<div className="space-y-4">
					{/* Name */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Name of the user?
						</label>
						<input
							type="text"
							readOnly
							value={user?.name || ''} // From user?_profile.name
							className="w-full p-3 border border-gray-300 rounded-lg outline-none"
						/>
					</div>

					{/* Phone Number */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Phone number
						</label>
						<input
							type="text"
							readOnly
							value={user?.phone_number || ''} // From user?_profile.phone_number
							className="w-full p-3 border border-gray-300 rounded-lg outline-none"
						/>
					</div>

					{/* Profession */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Profession
						</label>
						<input
							type="text"
							readOnly
							value={user?.profession || ''} // From user?_profile.Profession
							className="w-full p-3 border border-gray-300 rounded-lg outline-none"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Email</label>
						<input
							type="email"
							readOnly
							value={user?.email || ''} // From top-level email
							className="w-full p-3 border border-gray-300 rounded-lg outline-none"
						/>
					</div>

					{/* Done Button */}
					<button
						onClick={onClose}
						className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Done
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserDetailsModal;
