import { API_URL, getAuthHeaders } from './config';

export const academicAPI = {
    // Departments
    getDepartments: async () => {
        const response = await fetch(`${API_URL}/academics/departments`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch departments');
        return data;
    },
    createDepartment: async (departmentData) => {
        const response = await fetch(`${API_URL}/academics/departments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(departmentData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create department');
        return data;
    },
    updateDepartment: async (id, departmentData) => {
        const response = await fetch(`${API_URL}/academics/departments/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(departmentData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update department');
        return data;
    },
    deleteDepartment: async (id) => {
        const response = await fetch(`${API_URL}/academics/departments/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete department');
        return data;
    },

    // Subjects
    getSubjects: async () => {
        const response = await fetch(`${API_URL}/academics/subjects`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch subjects');
        return data;
    },
    createSubject: async (subjectData) => {
        const response = await fetch(`${API_URL}/academics/subjects`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(subjectData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create subject');
        return data;
    },
    updateSubject: async (id, subjectData) => {
        const response = await fetch(`${API_URL}/academics/subjects/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(subjectData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update subject');
        return data;
    },
    deleteSubject: async (id) => {
        const response = await fetch(`${API_URL}/academics/subjects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete subject');
        return data;
    },

    // Timetables
    getTimetables: async () => {
        const response = await fetch(`${API_URL}/academics/timetables`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch timetables');
        return data;
    },
    createTimetable: async (timetableData) => {
        const response = await fetch(`${API_URL}/academics/timetables`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(timetableData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create timetable');
        return data;
    },
    updateTimetable: async (id, timetableData) => {
        const response = await fetch(`${API_URL}/academics/timetables/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(timetableData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update timetable');
        return data;
    },
    deleteTimetable: async (id) => {
        const response = await fetch(`${API_URL}/academics/timetables/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete timetable');
        return data;
    },
};
