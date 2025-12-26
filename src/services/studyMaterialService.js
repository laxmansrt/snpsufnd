import { API_URL, getAuthHeaders } from './config';

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
