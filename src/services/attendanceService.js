const API_URL = 'https://snpsubknd.onrender.com/api';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
    };
};

export const attendanceAPI = {
    // Mark attendance for multiple students
    markAttendance: async (className, subject, date, attendanceData) => {
        const response = await fetch(`${API_URL}/attendance/mark`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ class: className, subject, date, attendanceData }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to mark attendance');
        return data;
    },

    // Get attendance records
    getAttendance: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/attendance?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch attendance');
        return data;
    },

    // Get attendance report/statistics
    getAttendanceReport: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/attendance/report?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch report');
        return data;
    },

    // Get students for a class
    getStudentsForClass: async (className) => {
        const response = await fetch(`${API_URL}/attendance/students?class=${className}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch students');
        return data;
    },
};
