import { API_URL, getAuthHeaders } from './config';

export const examAPI = {
    getExams: async () => {
        const response = await fetch(`${API_URL}/exams`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch exams');
        return data;
    },

    getExamById: async (id) => {
        const response = await fetch(`${API_URL}/exams/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch exam');
        return data;
    },

    createExam: async (examData) => {
        const response = await fetch(`${API_URL}/exams`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(examData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create exam');
        return data;
    },

    submitExam: async (id, answers) => {
        const response = await fetch(`${API_URL}/exams/${id}/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ answers }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to submit exam');
        return data;
    },

    sendInvites: async (id) => {
        const response = await fetch(`${API_URL}/exams/${id}/invite`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send invitations');
        return data;
    },
};
