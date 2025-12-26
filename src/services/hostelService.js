import { API_URL, getAuthHeaders } from './config';

export const hostelAPI = {
    getRooms: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/hostel?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch rooms');
        return data;
    },

    submitApplication: async (applicationData) => {
        const response = await fetch(`${API_URL}/hostel/application`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(applicationData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to submit application');
        return data;
    },

    getMyApplication: async () => {
        const response = await fetch(`${API_URL}/hostel/application/my`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch application');
        return data;
    },

    getApplications: async () => {
        const response = await fetch(`${API_URL}/hostel/applications`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch applications');
        return data;
    },

    updateApplicationStatus: async (id, statusData) => {
        const response = await fetch(`${API_URL}/hostel/application/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(statusData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update application');
        return data;
    },

    getMessMenu: async () => {
        const response = await fetch(`${API_URL}/hostel/mess/menu`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch mess menu');
        return data;
    }
};
