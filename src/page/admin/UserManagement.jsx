import { useState, useEffect, useRef } from 'react';
import {
	FiSearch,
	FiInfo,
	FiMoreHorizontal,
	FiTrash2,
	FiAlertTriangle,
} from 'react-icons/fi';
import Sidebar from '../../component/admin/Sidebar';
import UserDetailsModal from '../../component/admin/UserDetailsModal';
import GiveNoticeModal from '../../component/admin/GiveNoticeModal';
import { format } from 'date-fns'; // For formatting joined_date
import axiosInstance from '../../component/axiosInstance';

const UserManagement = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
	const [isGiveNoticeModalOpen, setIsGiveNoticeModalOpen] = useState(false);
	const [dropdownIndex, setDropdownIndex] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [users, setUsers] = useState([]); // State for fetched users
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state

	const dropdownRefs = useRef([]); // Array to store refs for each dropdown

	// Fetch users from API
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const response = await axiosInstance.get('/users/');
				// Map API data to table format
				const formattedUsers = response.data.map((user) => ({
					id: user.id,
					name: user.user_profile.name,
					startingDate: format(
						new Date(user.user_profile.joined_date),
						'dd MMMM yyyy'
					),
					email: user.email,
					role: user.role,
					phone_number: user.user_profile.phone_number,
					profession: user.user_profile.Profession,
				}));
				setUsers(formattedUsers);
				setError(null);
			} catch (err) {
				console.error('Error fetching users:', err);
				setError('Failed to load users. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []); // Fetch on mount

	// Filter users based on search term
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.id.toString().includes(searchTerm)
	);

	const toggleDropdown = (index) => {
		setDropdownIndex(dropdownIndex === index ? null : index);
	};

	const handleDeleteAccount = async (user) => {
		const confirmation = window.confirm(
			'Are you sure you want to delete this account?'
		);
		if (!confirmation) {
			return;
		}

		try {
			await axiosInstance.delete(`/users/${user.id}`);
			setUsers(users.filter((u) => u.id !== user.id));
			alert(`Deleted account for user: ${user.name}`);
		} catch (err) {
			console.error('Error deleting user:', err);
			alert('Failed to delete user.');
		}
		setDropdownIndex(null);
	};

	const handleGiveNotice = (user) => {
		setSelectedUser(user);
		setIsGiveNoticeModalOpen(true);
		setDropdownIndex(null);
	};

	const handleViewDetails = (user) => {
		setSelectedUser(user);
		setIsUserDetailsModalOpen(true);
	};

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			const isOutside = dropdownRefs.current.every(
				(ref, index) =>
					!ref || !ref.contains(event.target) || dropdownIndex !== index
			);

			if (isOutside && dropdownIndex !== null) {
				setDropdownIndex(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownIndex]);

	return (
		<Sidebar>
			<div className="h-[98vh] bg-gray-100 ml-2 py-12">
				<div className="p-3 mx-auto">
					{/* Header and Search Bar */}
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-semibold text-gray-800">
							User Management
						</h1>
						<div className="relative">
							<input
								type="text"
								placeholder="Search by username or ID"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
							/>
							<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>
					</div>

					{/* Error and Loading States */}
					{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
					{loading && (
						<div className="text-gray-600 text-sm mb-4">Loading users...</div>
					)}

					{/* Table */}
					{!loading && !error && (
						<div className="bg-white rounded-lg shadow-sm h-[80vh] overflow-y-auto">
							<table className="w-full text-left">
								<thead>
									<tr className="bg-gray-200 text-gray-600 text-sm font-medium">
										<th className="py-3 px-4">Serial No</th>
										<th className="py-3 px-4">Name</th>
										<th className="py-3 px-4">Starting Date</th>
										<th className="py-3 px-4">User Info</th>
										<th className="py-3 px-4">Action</th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.map((user, index) => (
										<tr
											key={user.id}
											className="border-t border-gray-200 text-gray-700 text-sm hover:bg-gray-50 relative">
											<td className="py-3 px-4">{index + 1}</td>
											<td className="py-3 px-4">{user.name}</td>
											<td className="py-3 px-4">{user.startingDate}</td>
											<td className="py-3 px-4">
												<button
													className="flex items-center text-gray-600 hover:text-blue-600"
													onClick={() => handleViewDetails(user)}>
													<FiInfo className="mr-1" />
													Click
												</button>
											</td>
											<td className="py-3 px-4">
												<button
													onClick={() => toggleDropdown(index)}
													className="text-gray-600 hover:text-blue-600">
													<FiMoreHorizontal />
												</button>
												{dropdownIndex === index && (
													<div
														ref={(el) => (dropdownRefs.current[index] = el)}
														className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
														<button
															onClick={() => handleDeleteAccount(user)}
															className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
															<FiTrash2 className="mr-2 text-gray-600" />
															Delete Account
														</button>
														<button
															onClick={() => handleGiveNotice(user)}
															className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
															<FiAlertTriangle className="mr-2 text-gray-600" />
															Give a Notice
														</button>
													</div>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* User Details Modal */}
			<UserDetailsModal
				isOpen={isUserDetailsModalOpen}
				onClose={() => {
					setIsUserDetailsModalOpen(false);
					setSelectedUser(null);
				}}
				user={selectedUser}
			/>

			{/* Give Notice Modal */}
			<GiveNoticeModal
				isOpen={isGiveNoticeModalOpen}
				onClose={() => {
					setIsGiveNoticeModalOpen(false);
					setSelectedUser(null);
				}}
				user={selectedUser}
			/>
		</Sidebar>
	);
};

export default UserManagement;
