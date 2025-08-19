import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { usersAPI } from '../../services/api';

export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers(1, 50, searchTerm);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'user': return 'default';
      case 'viewer': return 'secondary';
      default: return 'outline';
    }
  };

  const handleUserAction = (user, action) => {
    setSelectedUser(user);
    setModalMode(action);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(userId);
        fetchUsers();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: selectedUser?.name || '',
      email: selectedUser?.email || '',
      role: selectedUser?.role || 'user',
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (modalMode === 'create') {
          await usersAPI.createUser(formData);
        } else if (modalMode === 'edit') {
          await usersAPI.updateUser(selectedUser.id, formData);
        }
        fetchUsers();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to save user:', error);
      }
    };

    const handleChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create' ? 'Create New User' :
          modalMode === 'edit' ? 'Edit User' : 'User Details'
        }
      >
        {modalMode === 'view' ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedUser?.avatar && (
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser?.email}</p>
                <Badge variant={getRoleBadgeVariant(selectedUser?.role)}>
                  {selectedUser?.role}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Login</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedUser?.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={() => setModalMode('edit')}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleDeleteUser(selectedUser?.id)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus-visible:ring-blue-400"
              >
                <option value="viewer">Viewer</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                {modalMode === 'create' ? 'Create User' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => handleUserAction(null, 'create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>All Users</span>
              </CardTitle>
              <CardDescription>
                {users.length} total users
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    
                    <div className="flex items-center space-x-1">
                      {user.lastLogin ? (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <UserX className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.lastLogin ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUserAction(user, 'view')}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {users.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first user.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <UserModal />
    </div>
  );
};