// Mock data for Lost & Found items

let items = [
    {
        id: '1',
        type: 'lost',
        title: 'Blue Dell Laptop Bag',
        description: 'Lost my blue Dell laptop bag containing a charger and some notebooks. Last seen in the library.',
        location: 'Library, 2nd Floor',
        date: '2025-11-26',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=300',
        status: 'active', // active, claimed, archived
        user: { name: 'Rahul Kumar', role: 'student' },
        contact: 'rahul.k@snpsu.edu.in'
    },
    {
        id: '2',
        type: 'found',
        title: 'Silver Water Bottle',
        description: 'Found a silver metal water bottle near the canteen entrance.',
        location: 'Canteen',
        date: '2025-11-27',
        image: 'https://images.unsplash.com/photo-1602143407151-01114192003f?auto=format&fit=crop&q=80&w=300',
        status: 'active',
        user: { name: 'Security Guard', role: 'admin' },
        contact: 'security@snpsu.edu.in'
    },
    {
        id: '3',
        type: 'lost',
        title: 'Mathematics Textbook',
        description: 'Engineering Mathematics Vol 2. Left it on a bench in the park.',
        location: 'Campus Park',
        date: '2025-11-25',
        image: null,
        status: 'active',
        user: { name: 'Priya S', role: 'student' },
        contact: 'priya.s@snpsu.edu.in'
    }
];

export const getItems = () => {
    return Promise.resolve([...items]);
};

export const addItem = (item) => {
    const newItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    items = [newItem, ...items];
    return Promise.resolve(newItem);
};

export const claimItem = (id, claimer) => {
    items = items.map(item =>
        item.id === id ? { ...item, status: 'claimed', claimedBy: claimer } : item
    );
    return Promise.resolve(true);
};

export const deleteItem = (id) => {
    items = items.filter(item => item.id !== id);
    return Promise.resolve(true);
};
