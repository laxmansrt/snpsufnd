import { API_URL, getAuthHeaders } from './config';

export const assignmentAPI = {
    createAssignment: async (data) => {
        const response = await fetch(`${API_URL}/assignments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to create assignment');
        return result;
    },

    getAssignments: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/assignments?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch assignments');
        return result;
    },

    getAssignmentById: async (id) => {
        const response = await fetch(`${API_URL}/assignments/${id}`, {
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch assignment');
        return result;
    },

    submitAssignment: async (id, data) => {
        const response = await fetch(`${API_URL}/assignments/${id}/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to submit assignment');
        return result;
    },

    gradeSubmission: async (assignmentId, studentId, data) => {
        const response = await fetch(`${API_URL}/assignments/${assignmentId}/grade/${studentId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to grade submission');
        return result;
    },

    deleteAssignment: async (id) => {
        const response = await fetch(`${API_URL}/assignments/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to delete assignment');
        return result;
    },
};
