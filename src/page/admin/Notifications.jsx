import { useState, useEffect } from 'react';
import { FiBell, FiTrash2 } from 'react-icons/fi';
import Sidebar from '../../component/admin/Sidebar';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import axiosInstance from '../../component/axiosInstance';

const Notifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch notifications from API
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				setLoading(true);
				const response = await axiosInstance.get(
					'/get/user/all-notifications/'
				);
				// Map API data to UI format
				const formattedNotifications = response.data.map((notification) => ({
					id: notification.id,
					message: notification.message,
					timestamp: formatTimestamp(notification.created_at),
				}));
				setNotifications(formattedNotifications);
				setError(null);
			} catch (err) {
				console.error('Error fetching notifications:', err);
				setError('Failed to load notifications. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();
	}, []); // Fetch on mount

	// Format created_at to relative timestamp
	const formatTimestamp = (createdAt) => {
		const date = new Date(createdAt);
		if (isToday(date)) return 'Today';
		if (isYesterday(date)) return 'Yesterday';
		return `${formatDistanceToNow(date)} ago`;
	};

	// Handle deletion with confirmation
	const handleDelete = async (id) => {
		// Show confirmation dialog
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this notification?'
		);
		if (!confirmDelete) return; // Cancel deletion if user clicks "Cancel"

		try {
			await axiosInstance.delete(`/delete/${id}/notifications/`);
			setNotifications(
				notifications.filter((notification) => notification.id !== id)
			);
		} catch (err) {
			console.error('Error deleting notification:', err);
			alert('Failed to delete notification.');
		}
	};

	return (
		<Sidebar>
			<div className="h-[98vh] bg-gray-100 ml-2 py-12">
				<h2 className="text-2xl font-semibold text-gray-800 text-center my-4">
					Notifications
				</h2>
				<div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
					{/* Error and Loading States */}
					{error && <div className="text-red-500 text-sm p-4">{error}</div>}
					{loading && (
						<div className="text-gray-600 text-sm p-4">
							Loading notifications...
						</div>
					)}

					{/* Notification List */}
					{!loading && !error && (
						<div className="divide-y divide-gray-200">
							{notifications.length === 0 ? (
								<div className="p-4 text-gray-600 text-sm">
									No notifications found.
								</div>
							) : (
								notifications.map((notification) => (
									<div
										key={notification.id}
										className="flex items-center justify-between p-4 hover:bg-gray-50">
										<div>
											<p className="text-sm text-gray-700">
												{notification.message}
											</p>
											<p className="text-xs text-gray-500">
												{notification.timestamp}
											</p>
										</div>
										<button
											onClick={() => handleDelete(notification.id)}
											className="text-red-500 hover:text-red-600"
											title="Delete notification">
											<FiTrash2 size={16} />
										</button>
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</Sidebar>
	);
};

export default Notifications;
