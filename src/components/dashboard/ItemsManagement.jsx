import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Tag,
  Calendar,
  User,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { itemsAPI } from '../../services/api';

export const ItemsManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getItems(1, 50, filters.category, filters.status, searchTerm);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filters]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const handleItemAction = (item, action) => {
    setSelectedItem(item);
    setModalMode(action);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.deleteItem(itemId);
        fetchItems();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const ItemModal = () => {
    const [formData, setFormData] = useState({
      title: selectedItem?.title || '',
      description: selectedItem?.description || '',
      category: selectedItem?.category || 'Development',
      status: selectedItem?.status || 'pending',
      priority: selectedItem?.priority || 'medium',
      tags: selectedItem?.tags?.join(', ') || '',
      createdBy: selectedItem?.createdBy || '1',
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const itemData = {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        };

        if (modalMode === 'create') {
          await itemsAPI.createItem(itemData);
        } else if (modalMode === 'edit') {
          await itemsAPI.updateItem(selectedItem.id, itemData);
        }
        fetchItems();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to save item:', error);
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
          modalMode === 'create' ? 'Create New Item' :
          modalMode === 'edit' ? 'Edit Item' : 'Item Details'
        }
        size="lg"
      >
        {modalMode === 'view' ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedItem?.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedItem?.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedItem?.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge variant={getStatusBadgeVariant(selectedItem?.status)}>
                  {selectedItem?.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                <Badge variant={getPriorityBadgeVariant(selectedItem?.priority)}>
                  {selectedItem?.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {selectedItem?.tags && selectedItem.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={() => setModalMode('edit')}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleDeleteItem(selectedItem?.id)}
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
                Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter item title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
                rows={3}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus-visible:ring-blue-400"
                >
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Security">Security</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus-visible:ring-blue-400"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus-visible:ring-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <Input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., cloud, business, innovation"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                {modalMode === 'create' ? 'Create Item' : 'Save Changes'}
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Items Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your items, projects, and resources
          </p>
        </div>
        <Button onClick={() => handleItemAction(null, 'create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>All Items</span>
              </CardTitle>
              <CardDescription>
                {items.length} total items
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">All Categories</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Security">Security</option>
                </select>
                
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
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
                <div key={i} className="animate-pulse p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>{item.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>ID: {item.createdBy}</span>
                        </div>
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleItemAction(item, 'view')}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || filters.category || filters.status 
                      ? 'Try adjusting your search or filters.' 
                      : 'Get started by creating your first item.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ItemModal />
    </div>
  );
};