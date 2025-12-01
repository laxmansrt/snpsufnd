import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (role, credentials) => {
        try {
            // Import API service
            const { authAPI } = await import('../services/api');

            // Call real backend API
            const data = await authAPI.login(credentials.email, credentials.password, role);

            const userData = {
                id: data._id,
                name: data.name,
                role: data.role,
                email: data.email,
                token: data.token,
                studentData: data.studentData,
                facultyData: data.facultyData,
                parentData: data.parentData,
                avatar: `https://ui-avatars.com/api/?name=${data.name}&background=random`
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message || 'Login failed. Please check your credentials.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
