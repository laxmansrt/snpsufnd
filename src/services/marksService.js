const API_URL = import.meta.env.VITE_API_URL || 'https://snpsubknd.onrender.com/api';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
    };
};

export const marksAPI = {
    // Get marks for current student
    getMarks: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/marks?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch marks');
        return data;
    },

    // Upload marks (Faculty/Admin)
    uploadMarks: async (marksData) => {
        const response = await fetch(`${API_URL}/marks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(marksData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to upload marks');
        return data;
    },
};
