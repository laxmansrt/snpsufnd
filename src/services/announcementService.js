import { API_URL, getAuthHeaders } from './config';

export const announcementAPI = {
    // Create announcement
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

    // Get all announcements
    getAnnouncements: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/announcements?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch announcements');
        return data;
    },

    // Get single announcement
    getAnnouncementById: async (id) => {
        const response = await fetch(`${API_URL}/announcements/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch announcement');
        return data;
    },

    // Update announcement
    updateAnnouncement: async (id, announcementData) => {
        const response = await fetch(`${API_URL}/announcements/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(announcementData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update announcement');
        return data;
    },

    // Delete announcement
    deleteAnnouncement: async (id) => {
        const response = await fetch(`${API_URL}/announcements/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete announcement');
        return data;
    },

    // Mark as read
    markAsRead: async (id) => {
        const response = await fetch(`${API_URL}/announcements/${id}/read`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to mark as read');
        return data;
    },
};
