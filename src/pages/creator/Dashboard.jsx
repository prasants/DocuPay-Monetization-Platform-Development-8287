import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { documentService } from '../../services/documentService';

const { FiPlus, FiDollarSign, FiEye, FiShoppingCart, FiTrendingUp, FiSettings, FiExternalLink, FiFileText } = FiIcons;

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalViews: 0,
    totalDocuments: 0
  });

  useEffect(() => {
    if (user) {
      loadUserDocuments();
    }
  }, [user]);

  const loadUserDocuments = async () => {
    try {
      setLoading(true);
      const result = await documentService.getUserDocuments();
      
      if (result.success) {
        setDocuments(result.data);
        calculateStats(result.data);
      } else {
        toast.error('Failed to load documents');
      }
    } catch (error) {
      toast.error('Error loading documents');
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (docs) => {
    const totalRevenue = docs.reduce((sum, doc) => sum + (doc.revenue || 0), 0);
    const totalSales = docs.reduce((sum, doc) => sum + (doc.sales || 0), 0);
    const totalViews = docs.reduce((sum, doc) => sum + (doc.views || 0), 0);

    setStats({
      totalRevenue,
      totalSales,
      totalViews,
      totalDocuments: docs.length
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const copyShareLink = (shareId) => {
    const link = `${window.location.origin}/#/doc/${shareId}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.display_name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your documents today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiDollarSign} className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiShoppingCart} className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiEye} className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Documents Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Documents</h2>
          <Link to="/add-document">
            <Button>
              <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </Link>
        </div>

        {documents.length === 0 ? (
          <Card className="p-12 text-center">
            <SafeIcon icon={FiPlus} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first Google Doc to monetize.
            </p>
            <Link to="/add-document">
              <Button>Add Your First Document</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden" hover>
                  <div className="aspect-video bg-gray-100 relative">
                    {doc.cover_image_url ? (
                      <img
                        src={doc.cover_image_url}
                        alt={doc.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                        <SafeIcon icon={FiFileText} className="h-12 w-12 text-primary-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        doc.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {doc.description || 'No description provided'}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(doc.price)}
                      </span>
                      <div className="text-sm text-gray-500">
                        {doc.sales || 0} sales
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Views:</span>
                        <span className="ml-1 font-medium">{doc.views || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Revenue:</span>
                        <span className="ml-1 font-medium">{formatCurrency(doc.revenue)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => copyShareLink(doc.share_id)}
                      >
                        <SafeIcon icon={FiExternalLink} className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Link to={`/document/${doc.id}/settings`} className="flex-1">
                        <Button size="sm" variant="ghost" className="w-full">
                          <SafeIcon icon={FiSettings} className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;