import { API_URL, getAuthHeaders } from './config';

export const placementAPI = {
    // HRD/Admin endpoints
    createDrive: async (driveData) => {
        const response = await fetch(`${API_URL}/placements`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(driveData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create placement drive');
        return data;
    },

    updateDrive: async (id, driveData) => {
        const response = await fetch(`${API_URL}/placements/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(driveData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update placement drive');
        return data;
    },

    deleteDrive: async (id) => {
        const response = await fetch(`${API_URL}/placements/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete placement drive');
        return data;
    },

    updateApplicantStatus: async (id, studentId, status) => {
        const response = await fetch(`${API_URL}/placements/${id}/applicant/${studentId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update applicant status');
        return data;
    },

    // Student endpoints
    applyForDrive: async (id, applicationData) => {
        const response = await fetch(`${API_URL}/placements/${id}/apply`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(applicationData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to apply for placement drive');
        return data;
    },

    // Shared endpoints
    getDrives: async () => {
        const response = await fetch(`${API_URL}/placements`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch placement drives');
        return data;
    },

    getDriveById: async (id) => {
        const response = await fetch(`${API_URL}/placements/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch drive details');
        return data;
    }
};
