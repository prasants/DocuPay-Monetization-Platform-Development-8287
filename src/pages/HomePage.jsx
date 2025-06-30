import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiShield, FiBarChart3, FiUsers, FiCheck, FiArrowRight } = FiIcons;

const HomePage = () => {
  const features = [
    {
      icon: FiDollarSign,
      title: 'Monetize Your Docs',
      description: 'Turn your Google Docs into revenue streams with simple paywalls'
    },
    {
      icon: FiShield,
      title: 'Secure Payments',
      description: 'Stripe integration ensures safe and reliable payment processing'
    },
    {
      icon: FiBarChart3,
      title: 'Analytics Dashboard',
      description: 'Track views, sales, and revenue with detailed analytics'
    },
    {
      icon: FiUsers,
      title: 'Customer Management',
      description: 'Manage access permissions and customer communications'
    }
  ];

  const benefits = [
    'Connect your Google account in seconds',
    'Set custom prices for each document',
    'Automatic access management',
    'Real-time sales tracking',
    'Email notifications for purchases',
    'Mobile-responsive payment pages'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Monetize Your{' '}
              <span className="gradient-text">Google Docs</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transform your knowledge into revenue. Create paywalls for your Google Docs, 
              track sales, and grow your content business with DocuPay.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <SafeIcon icon={FiArrowRight} className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Sell Your Content
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed for content creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Start Earning From Your Knowledge
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                DocuPay makes it incredibly easy to monetize your existing Google Docs. 
                No need to migrate your content or learn new tools.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of creators already monetizing their content with DocuPay
          </p>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;