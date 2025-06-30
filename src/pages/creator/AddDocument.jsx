import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { documentService } from '../../services/documentService';

const { FiFileText, FiArrowLeft, FiUpload, FiDollarSign, FiTag } = FiIcons;

const AddDocument = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  // Mock Google Docs for demo - in real app this would come from Google Drive API
  const mockGoogleDocs = [
    {
      id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      title: 'Advanced React Patterns Guide',
      lastModified: '2024-01-25T10:30:00Z',
      url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
    },
    {
      id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms2',
      title: 'TypeScript Best Practices',
      lastModified: '2024-01-24T15:45:00Z',
      url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms2/edit'
    },
    {
      id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms3',
      title: 'Node.js Performance Optimization',
      lastModified: '2024-01-23T09:20:00Z',
      url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms3/edit'
    }
  ];

  // Auto-fill title when document is selected
  React.useEffect(() => {
    if (selectedDoc) {
      setValue('title', selectedDoc.title);
    }
  }, [selectedDoc, setValue]);

  const onSubmit = async (data) => {
    if (!selectedDoc) {
      toast.error('Please select a Google Doc');
      return;
    }

    setLoading(true);
    try {
      const documentData = {
        google_doc_id: selectedDoc.id,
        google_doc_url: selectedDoc.url,
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        preview_content: data.preview_content || `This is a preview of "${data.title}". Purchase to access the full document with detailed content and examples.`,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        cover_image_url: data.cover_image_url || null
      };

      const result = await documentService.createDocument(documentData);
      
      if (result.success) {
        toast.success('Document added successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to add document');
      }
    } catch (error) {
      toast.error('Failed to add document. Please try again.');
      console.error('Error adding document:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Document
          </h1>
          <p className="text-gray-600">
            Select a Google Doc and set up your paywall to start earning.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Document Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiFileText} className="h-5 w-5 mr-2" />
              Select Google Doc
            </h2>
            
            <div className="space-y-3">
              {mockGoogleDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDoc?.id === doc.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        Last modified: {formatDate(doc.lastModified)}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedDoc?.id === doc.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedDoc?.id === doc.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Make sure your Google Doc is set to "Anyone with the link can view" 
                for the preview to work properly.
              </p>
            </div>
          </Card>

          {/* Document Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiTag} className="h-5 w-5 mr-2" />
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
                  placeholder="Enter document title"
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
                    placeholder="29.99"
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
                placeholder="Describe what customers will get when they purchase this document..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Content
              </label>
              <textarea
                {...register('preview_content')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter a preview of your document content..."
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be shown to potential customers before purchase
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="React, JavaScript, Tutorial, Web Development"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                {...register('cover_image_url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended size: 800x600px
              </p>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocument;