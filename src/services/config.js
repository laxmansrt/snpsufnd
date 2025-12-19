const base_url = import.meta.env.VITE_API_URL || 'https://snpsubknd.vercel.app';
export const API_URL = base_url.endsWith('/api') ? base_url : `${base_url}/api`;

export const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
    };
};
