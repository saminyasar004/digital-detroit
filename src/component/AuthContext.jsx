import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Provide AuthContext to children
export const AuthProvider = ({ children }) => {
	// Initialize auth state with localStorage values
	const [auth, setAuth] = useState(() => {
		const token = localStorage.getItem('authToken');
		const email = localStorage.getItem('email');
		return { token: token || null, email: email || null };
	});

	// Login function
	const login = (token, email) => {
		setAuth({ token, email });
		localStorage.setItem('authToken', token);
		localStorage.setItem('email', email);
	};

	// Logout function
	const logout = () => {
		setAuth({ token: null, email: null });
		localStorage.removeItem('authToken');
		localStorage.removeItem('email');
	};

	// Check if user is authenticated
	const isAuthenticated = !!auth.token;

	return (
		<AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
