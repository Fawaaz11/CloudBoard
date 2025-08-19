// Mock data storage - simulates PostgreSQL database
let mockUsers = [
  {
    id: '1',
    email: 'admin@cloudboard.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@cloudboard.com',
    name: 'Regular User',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'viewer@cloudboard.com',
    name: 'Viewer User',
    role: 'viewer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-03T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
];

let mockItems = [
  {
    id: '1',
    title: 'Project Alpha',
    description: 'A revolutionary cloud-based solution for modern businesses',
    category: 'Development',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    tags: ['cloud', 'business', 'innovation'],
    priority: 'high',
  },
  {
    id: '2',
    title: 'Marketing Campaign Q1',
    description: 'Q1 2024 marketing strategy and implementation',
    category: 'Marketing',
    status: 'pending',
    createdBy: '2',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    tags: ['marketing', 'strategy', 'Q1'],
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Security Audit',
    description: 'Comprehensive security review and vulnerability assessment',
    category: 'Security',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    tags: ['security', 'audit', 'compliance'],
    priority: 'high',
  },
  {
    id: '4',
    title: 'UI/UX Redesign',
    description: 'Complete redesign of the user interface and experience',
    category: 'Design',
    status: 'inactive',
    createdBy: '2',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    tags: ['design', 'ui', 'ux'],
    priority: 'low',
  },
];

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API - simulates FastAPI authentication endpoints
export const authAPI = {
  async login(email, password) {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    const updatedUser = { ...user, lastLogin: new Date().toISOString() };
    mockUsers = mockUsers.map(u => u.id === user.id ? updatedUser : u);

    return {
      data: {
        user: updatedUser,
        token: `jwt_token_${user.id}_${Date.now()}`,
      },
      message: 'Login successful',
      success: true,
    };
  },

  async register(email, password, name) {
    await delay(1000);
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: generateId(),
      email,
      name,
      role: 'user',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      data: {
        user: newUser,
        token: `jwt_token_${newUser.id}_${Date.now()}`,
      },
      message: 'Registration successful',
      success: true,
    };
  },
};

// Users API - simulates FastAPI CRUD endpoints
export const usersAPI = {
  async getUsers(page = 1, limit = 10, search = '') {
    await delay(500);
    
    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    };
  },

  async getUserById(id) {
    await delay(300);
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      data: user,
      message: 'User retrieved successfully',
      success: true,
    };
  },

  async createUser(userData) {
    await delay(500);
    
    if (mockUsers.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: userData.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    };

    mockUsers.push(newUser);

    return {
      data: newUser,
      message: 'User created successfully',
      success: true,
    };
  },

  async updateUser(id, userData) {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };

    return {
      data: mockUsers[userIndex],
      message: 'User updated successfully',
      success: true,
    };
  },

  async deleteUser(id) {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(userIndex, 1);

    return {
      data: null,
      message: 'User deleted successfully',
      success: true,
    };
  },
};

// Items API - simulates FastAPI CRUD endpoints
export const itemsAPI = {
  async getItems(page = 1, limit = 10, category = '', status = '', search = '') {
    await delay(500);
    
    let filteredItems = mockItems;
    
    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }
    
    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status);
    }
    
    if (search) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = filteredItems.slice(start, end);

    return {
      data: paginatedItems,
      total: filteredItems.length,
      page,
      limit,
      totalPages: Math.ceil(filteredItems.length / limit),
    };
  },

  async getItemById(id) {
    await delay(300);
    
    const item = mockItems.find(i => i.id === id);
    if (!item) {
      throw new Error('Item not found');
    }

    return {
      data: item,
      message: 'Item retrieved successfully',
      success: true,
    };
  },

  async createItem(itemData) {
    await delay(500);
    
    const newItem = {
      ...itemData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockItems.push(newItem);

    return {
      data: newItem,
      message: 'Item created successfully',
      success: true,
    };
  },

  async updateItem(id, itemData) {
    await delay(500);
    
    const itemIndex = mockItems.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    mockItems[itemIndex] = { 
      ...mockItems[itemIndex], 
      ...itemData, 
      updatedAt: new Date().toISOString() 
    };

    return {
      data: mockItems[itemIndex],
      message: 'Item updated successfully',
      success: true,
    };
  },

  async deleteItem(id) {
    await delay(500);
    
    const itemIndex = mockItems.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    mockItems.splice(itemIndex, 1);

    return {
      data: null,
      message: 'Item deleted successfully',
      success: true,
    };
  },
};

// Analytics API - simulates data analytics endpoints
export const analyticsAPI = {
  async getDashboardStats() {
    await delay(300);
    
    return {
      data: {
        totalUsers: mockUsers.length,
        activeItems: mockItems.filter(item => item.status === 'active').length,
        totalItems: mockItems.length,
        recentActivity: [
          {
            id: 1,
            action: 'New user registered',
            user: 'john.doe@example.com',
            time: '2 minutes ago',
            type: 'user',
          },
          {
            id: 2,
            action: 'Item updated',
            user: 'Project Alpha',
            time: '5 minutes ago',
            type: 'item',
          },
          {
            id: 3,
            action: 'System backup completed',
            user: 'System',
            time: '1 hour ago',
            type: 'system',
          },
        ],
      },
      success: true,
    };
  },
};