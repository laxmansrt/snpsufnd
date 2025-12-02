import { lostFoundAPI } from './api'; // Re-using the base API_URL from api.js logic
// Actually, let's just import API_URL logic or duplicate it to avoid circular deps if api.js imports this.
// But api.js doesn't import this.
// However, api.js exports specific objects. I should probably add studyMaterialAPI to api.js or create a new service file.
// Let's create a new service file that follows the pattern.

const API_URL = import.meta.env.VITE_API_URL || 'https://snpsubknd.onrender.com/api';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
    };
};

export const studyMaterialAPI = {
    getMaterials: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/materials?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch materials');
        return data;
    },

    uploadMaterial: async (materialData) => {
        const response = await fetch(`${API_URL}/materials`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(materialData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to upload material');
        return data;
    },

    deleteMaterial: async (id) => {
        const response = await fetch(`${API_URL}/materials/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete material');
        return data;
    },
};
