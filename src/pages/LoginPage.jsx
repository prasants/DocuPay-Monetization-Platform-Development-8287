import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiArrowLeft } = FiIcons;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to sign in');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <SafeIcon icon={FiFileText} className="h-10 w-10 text-primary-600" />
          <span className="text-2xl font-bold gradient-text">DocuPay</span>
        </Link>

        <motion.div
          className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to DocuPay
            </h2>
            <p className="text-gray-600">
              Sign in with your Google account to get started
            </p>
          </div>

          <div className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              loading={loading}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5 mr-3"
              />
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <Link to="/" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <SafeIcon icon={FiArrowLeft} className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;