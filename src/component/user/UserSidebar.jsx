import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { useAuth } from '../AuthContext';
import axiosInstance from '../axiosInstance';

const UserSidebar = ({ isOpen, toggleSidebar, refreshKey, setData }) => {
	const { isAuthenticated } = useAuth();
	const [activeTab, setActiveTab] = useState('Saved pdf');
	const [pdfList, setPdfList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Format date and time from created_at
	const formatDateTime = (createdAt) => {
		const date = new Date(createdAt);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		const isToday =
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear();
		const isYesterday =
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear();

		let formattedDate;
		if (isToday) {
			formattedDate = 'Today';
		} else if (isYesterday) {
			formattedDate = 'Yesterday';
		} else {
			formattedDate = date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		}

		const formattedTime = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});

		return { date: formattedDate, time: formattedTime };
	};

	// Fetch templates
	useEffect(() => {
		if (!isAuthenticated) return;

		const fetchTemplates = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get('/get-template/');
				const templates = response.data.map((template) => ({
					id: template.id,
					title: template.title || template.content.title || 'Untitled',
					...formatDateTime(template.created_at),
				}));
				setPdfList(templates);
				setError(null);
			} catch (err) {
				console.error('Error fetching templates:', err);
				setError('Failed to load templates.');
			} finally {
				setLoading(false);
			}
		};

		fetchTemplates();
	}, [isAuthenticated, refreshKey]);

	// Group items by date
	const groupByDate = (items) => {
		return items.reduce((acc, item) => {
			const date = item.date;
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(item);
			return acc;
		}, {});
	};

	const handleRowClick = async (id) => {
		try {
			const response = await axiosInstance.get(`/get-template/${id}/`);
			setData(response.data);
			localStorage.setItem('templateData', JSON.stringify(response.data));
		} catch (err) {
			console.error('Error fetching template:', err);
			setError('Failed to load template.');
		}
	};

	const groupedPdfList = groupByDate(pdfList);

	return (
		<div
			className={`md:w-[14%] bg-[#F6F8FA] border-r border-[#B3BECC] transform transition-transform duration-300 ${
				isOpen ? 'translate-x-0' : '-translate-x-full'
			} fixed h-[calc(100vh-80px)] shadow top-[75px] z-50`}>
			<div className="bg-[#DBF1FB] py-[2px] px-4 pt-2 mb-3 shadow-lg">
				<div className="flex mb-4 text-sm">
					<button
						onClick={() => setActiveTab('PDF List')}
						className={`flex-1 py-2 rounded-lg ${
							activeTab === 'PDF List'
								? 'bg-blue-600 text-white'
								: 'bg-gray-200 text-gray-700'
						} hover:bg-blue-700 hover:text-white`}>
						PDF List
					</button>
				</div>
			</div>
			<div className="px-3">
				<div className="flex items-center justify-start mb-4">
					<h2 className="text-lg font-semibold">
						{activeTab === 'History' ? 'Chat History' : 'Saved pdf'}
					</h2>
				</div>

				{loading && <p className="text-sm text-gray-600">Loading...</p>}
				{error && <p className="text-sm text-red-500">{error}</p>}

				<div className="space-y-2 h-[74vh] overflow-y-auto">
					{Object.keys(groupedPdfList).map((date) => (
						<div key={date}>
							<p className="text-sm font-medium">{date}</p>
							{groupedPdfList[date].map((pdf, index) => (
								<div
									onClick={() => handleRowClick(pdf.id)}
									key={index}
									className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
									<p className="text-xs text-gray-600">
										{index + 1}. {pdf.title} ({pdf.time})
									</p>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserSidebar;
