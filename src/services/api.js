import { API_URL, getAuthHeaders } from './config';

// Auth API
export const authAPI = {
    login: async (email, password, role) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },

    bulkRegister: async (usersData) => {
        const response = await fetch(`${API_URL}/auth/bulk-register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(usersData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Bulk registration failed');
        return data;
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch user');
        return data;
    },

    getUsers: async (role) => {
        const queryParams = role ? `?role=${role}` : '';
        const response = await fetch(`${API_URL}/auth/users${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        return data;
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update profile');
        return data;
    },

    updatePassword: async (passwordData) => {
        const response = await fetch(`${API_URL}/auth/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(passwordData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update password');
        return data;
    },
};

// Lost & Found API
export const lostFoundAPI = {
    getItems: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/lostfound?${queryParams}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch items');
        return data;
    },

    getItemById: async (id) => {
        const response = await fetch(`${API_URL}/lostfound/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch item');
        return data;
    },

    createItem: async (itemData) => {
        const response = await fetch(`${API_URL}/lostfound`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(itemData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create item');
        return data;
    },

    updateItem: async (id, itemData) => {
        const response = await fetch(`${API_URL}/lostfound/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(itemData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update item');
        return data;
    },

    deleteItem: async (id) => {
        const response = await fetch(`${API_URL}/lostfound/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete item');
        return data;
    },
};

// Announcement API
export const announcementAPI = {
    createAnnouncement: async (announcementData) => {
        const response = await fetch(`${API_URL}/announcements`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(announcementData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create announcement');
        return data;
    },
};
