import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import './App.css';
import LandingPage from './page/LandingPage';
import RegistrationPage from './authentication/Registration';
import ActivateEmail from './authentication/ActivateEmail';
import OtpVerification from './authentication/OtpVerification';
import ResetPassword from './authentication/ResetPassword';
import ForgetEmail from './authentication/ForgetEmail';
import UserManagement from './page/admin/UserManagement';
import Notifications from './page/admin/Notifications';
import UserChatPage from './page/user/UserChatPage';
import ReactPDf from './page/TemplatePage';
import { useAuth } from './component/AuthContext';
import Login from './authentication/Login';

// ProtectedRoute: Handles authentication and role-based access
const ProtectedRoute = ({ element, adminOnly }) => {
	const { isAuthenticated } = useAuth();
	const role = localStorage.getItem('role');

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (adminOnly && role !== 'admin') {
		return <Navigate to="/chat" replace />; // Redirect users to /chat if they try to access admin-only routes
	}

	return element;
};

// PublicRoute: Redirects authenticated users based on role
const PublicRoute = ({ element }) => {
	const { isAuthenticated, user } = useAuth();

	if (isAuthenticated) {
		// Redirect based on role
		return (
			<Navigate to={user?.role === 'admin' ? '/dashboard' : '/chat'} replace />
		);
	}

	return element;
};

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/login" element={<PublicRoute element={<Login />} />} />
				<Route
					path="/signup"
					element={<PublicRoute element={<RegistrationPage />} />}
				/>
				<Route path="/" element={<LandingPage />} />
				<Route
					path="/forget-password"
					element={<PublicRoute element={<ForgetEmail />} />}
				/>
				<Route
					path="/otp-verification"
					element={<PublicRoute element={<OtpVerification />} />}
				/>
				<Route
					path="/password-reset/confirm"
					element={<PublicRoute element={<ResetPassword />} />}
				/>
				<Route
					path="/activate-email"
					element={<PublicRoute element={<ActivateEmail />} />}
				/>
				<Route
					path="/ReactPDf"
					element={<PublicRoute element={<ReactPDf />} />}
				/>

				{/* Protected Routes */}
				<Route
					path="/dashboard"
					element={<ProtectedRoute element={<UserManagement />} adminOnly />}
				/>
				<Route
					path="/notification"
					element={<ProtectedRoute element={<Notifications />} adminOnly />}
				/>
				<Route
					path="/chat"
					element={<ProtectedRoute element={<UserChatPage />} />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
