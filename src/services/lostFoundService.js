import { lostFoundAPI } from './api';

// Helper to map backend format to frontend format
const mapItem = (item) => ({
    ...item,
    id: item._id,
    user: (item.reportedBy && typeof item.reportedBy === 'object') ? {
        name: item.reportedBy.name,
        email: item.reportedBy.email,
        role: 'student'
    } : { name: 'User', role: 'student' }
});

export const getItems = async () => {
    try {
        const data = await lostFoundAPI.getItems();
        return data.map(mapItem);
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};

export const addItem = async (item) => {
    try {
        const data = await lostFoundAPI.createItem(item);
        // The create response might not have populated user, so we might need to rely on the reload
        // or manually construct the return object if the component uses it immediately.
        // But LostFound.jsx calls loadItems() after addItem(), so the return value is less critical 
        // as long as it doesn't throw.
        return mapItem(data);
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};

export const claimItem = async (id, claimer) => {
    try {
        // First get the item to preserve other fields
        const item = await lostFoundAPI.getItemById(id);
        const updatedItem = {
            ...item,
            status: 'claimed',
            claimedBy: claimer
        };
        const data = await lostFoundAPI.updateItem(id, updatedItem);
        return mapItem(data);
    } catch (error) {
        console.error('Error claiming item:', error);
        throw error;
    }
};

export const deleteItem = async (id) => {
    try {
        await lostFoundAPI.deleteItem(id);
        return true;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};
