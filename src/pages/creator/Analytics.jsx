import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { toast } from 'react-hot-toast';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { documentService } from '../../services/documentService';

const { FiTrendingUp, FiDollarSign, FiEye, FiShoppingCart, FiCalendar, FiBarChart3 } = FiIcons;

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [documents, setDocuments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalViews: 0,
    conversionRate: 0
  });

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const result = await documentService.getUserAnalytics();
      
      if (result.success) {
        setDocuments(result.data.documents);
        setPurchases(result.data.purchases);
        calculateStats(result.data.documents);
      } else {
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      toast.error('Error loading analytics');
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (docs) => {
    const totalRevenue = docs.reduce((sum, doc) => sum + (doc.revenue || 0), 0);
    const totalSales = docs.reduce((sum, doc) => sum + (doc.sales || 0), 0);
    const totalViews = docs.reduce((sum, doc) => sum + (doc.views || 0), 0);
    const conversionRate = totalViews > 0 ? (totalSales / totalViews * 100) : 0;

    setStats({
      totalRevenue,
      totalSales,
      totalViews,
      conversionRate
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Process purchases data for chart
  const processRevenueData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const revenueByDay = last7Days.map(date => {
      const dayPurchases = purchases.filter(p => 
        p.created_at.split('T')[0] === date
      );
      return dayPurchases.reduce((sum, p) => sum + (p.creator_earnings || 0), 0);
    });

    return {
      dates: last7Days.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      revenue: revenueByDay
    };
  };

  const revenueData = processRevenueData();

  // Chart options for revenue over time
  const revenueChartOption = {
    title: {
      text: 'Revenue Over Time',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const point = params[0];
        return `${point.name}<br/>Revenue: ${formatCurrency(point.value)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: revenueData.dates,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    series: [{
      data: revenueData.revenue,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#0ea5e9',
        width: 3
      },
      itemStyle: {
        color: '#0ea5e9'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(14, 165, 233, 0.2)'
          }, {
            offset: 1, color: 'rgba(14, 165, 233, 0.05)'
          }]
        }
      }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  // Chart options for document performance
  const documentChartOption = {
    title: {
      text: 'Document Performance',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Views', 'Sales'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: documents.map(doc => doc.title.substring(0, 20) + '...'),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Views',
        type: 'bar',
        data: documents.map(doc => doc.views || 0),
        itemStyle: {
          color: '#8b5cf6'
        }
      },
      {
        name: 'Sales',
        type: 'bar',
        data: documents.map(doc => doc.sales || 0),
        itemStyle: {
          color: '#0ea5e9'
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    }
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics
              </h1>
              <p className="text-gray-600">
                Track your document performance and sales metrics.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                  <p className="text-xs text-green-600">All time</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SafeIcon icon={FiShoppingCart} className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                  <p className="text-xs text-blue-600">All time</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SafeIcon icon={FiEye} className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                  <p className="text-xs text-purple-600">All time</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-orange-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-600">Views to sales</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        {documents.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <ReactECharts option={revenueChartOption} style={{ height: '300px' }} />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6">
                  <ReactECharts option={documentChartOption} style={{ height: '300px' }} />
                </Card>
              </motion.div>
            </div>

            {/* Top Performing Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Top Performing Documents
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents
                        .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                        .map((doc) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {doc.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatCurrency(doc.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {doc.views || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {doc.sales || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(doc.revenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {doc.views > 0 ? (((doc.sales || 0) / doc.views) * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </>
        )}

        {documents.length === 0 && (
          <Card className="p-12 text-center">
            <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No analytics data yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first document to start tracking analytics.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;