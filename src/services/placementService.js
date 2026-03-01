import api from './api';

export const placementAPI = {
    // HRD/Admin endpoints
    createDrive: async (driveData) => {
        const response = await api.post('/placements', driveData);
        return response.data;
    },

    updateDrive: async (id, driveData) => {
        const response = await api.put(`/placements/${id}`, driveData);
        return response.data;
    },

    deleteDrive: async (id) => {
        const response = await api.delete(`/placements/${id}`);
        return response.data;
    },

    updateApplicantStatus: async (id, studentId, status) => {
        const response = await api.put(`/placements/${id}/applicant/${studentId}`, { status });
        return response.data;
    },

    // Student endpoints
    applyForDrive: async (id, applicationData) => {
        const response = await api.post(`/placements/${id}/apply`, applicationData);
        return response.data;
    },

    // Shared endpoints
    getDrives: async () => {
        const response = await api.get('/placements');
        return response.data;
    },

    getDriveById: async (id) => {
        const response = await api.get(`/placements/${id}`);
        return response.data;
    }
};
