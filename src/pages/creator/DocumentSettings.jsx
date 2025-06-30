import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { mockDocuments } from '../../data/mockData';

const { FiArrowLeft, FiSettings, FiDollarSign, FiToggleLeft, FiToggleRight, FiTrash2, FiExternalLink } = FiIcons;

const DocumentSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    // Load document data
    const doc = mockDocuments.find(d => d.id === id);
    if (doc) {
      setDocument(doc);
      setValue('title', doc.title);
      setValue('description', doc.description);
      setValue('price', doc.price);
      setValue('tags', doc.tags.join(', '));
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Document updated successfully!');
    } catch (error) {
      toast.error('Failed to update document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async () => {
    try {
      setDocument(prev => ({ ...prev, isActive: !prev.isActive }));
      toast.success(`Document ${document.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      toast.error('Failed to update status. Please try again.');
    }
  };

  const deleteDocument = async () => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Document deleted successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete document. Please try again.');
      }
    }
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/#/doc/${id}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard!');
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">Document not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <SafeIcon icon={FiArrowLeft} className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Document Settings
              </h1>
              <p className="text-gray-600">
                Manage your document settings and paywall configuration.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                document.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {document.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={copyShareLink}
                className="flex items-center justify-center"
              >
                <SafeIcon icon={FiExternalLink} className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleActiveStatus}
                className="flex items-center justify-center"
              >
                <SafeIcon 
                  icon={document.isActive ? FiToggleRight : FiToggleLeft} 
                  className="h-4 w-4 mr-2" 
                />
                {document.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              
              <Button
                variant="outline"
                onClick={deleteDocument}
                className="flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <SafeIcon icon={FiTrash2} className="h-4 w-4 mr-2" />
                Delete Document
              </Button>
            </div>
          </Card>

          {/* Document Details */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiSettings} className="h-5 w-5 mr-2" />
                Document Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiDollarSign} className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0.99, message: 'Minimum price is $0.99' }
                      })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </Card>
          </form>

          {/* Performance Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Performance Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {document.views}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {document.sales}
                </div>
                <div className="text-sm text-gray-600">Total Sales</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  ${document.revenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;