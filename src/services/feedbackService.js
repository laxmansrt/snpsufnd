import { API_URL, getAuthHeaders } from './config';

export const feedbackAPI = {
    createFeedback: async (data) => {
        const response = await fetch(`${API_URL}/feedback`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to create feedback form');
        return result;
    },

    getFeedbackForms: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/feedback?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch feedback forms');
        return result;
    },

    getFeedbackById: async (id) => {
        const response = await fetch(`${API_URL}/feedback/${id}`, {
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch feedback');
        return result;
    },

    submitResponse: async (id, data) => {
        const response = await fetch(`${API_URL}/feedback/${id}/respond`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to submit response');
        return result;
    },

    deleteFeedback: async (id) => {
        const response = await fetch(`${API_URL}/feedback/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to delete feedback');
        return result;
    },
};
