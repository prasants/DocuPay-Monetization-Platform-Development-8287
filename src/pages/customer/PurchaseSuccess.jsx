import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { mockDocuments } from '../../data/mockData';

const { FiCheckCircle, FiFileText, FiMail, FiExternalLink, FiHome } = FiIcons;

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const [document, setDocument] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const docId = searchParams.get('doc');
    const email = searchParams.get('email');
    
    if (docId) {
      const doc = mockDocuments.find(d => d.id === docId);
      setDocument(doc);
    }
    
    if (email) {
      setCustomerEmail(email);
    }
  }, [searchParams]);

  const openDocument = () => {
    if (document?.googleDocUrl) {
      window.open(document.googleDocUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFileText} className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900">DocuPay</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mb-8">
            <SafeIcon icon={FiCheckCircle} className="h-16 w-16 text-green-500 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Purchase Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. You now have full access to the document.
          </p>

          {/* Document Info */}
          {document && (
            <Card className="p-6 mb-8 text-left">
              <div className="flex items-start space-x-4">
                <img
                  src={document.coverImage}
                  alt={document.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {document.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {document.description.substring(0, 120)}...
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-primary-600">
                      ${document.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Purchased successfully
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              onClick={openDocument}
              size="lg"
              className="w-full sm:w-auto"
            >
              <SafeIcon icon={FiExternalLink} className="h-5 w-5 mr-2" />
              Open Document
            </Button>
            
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-500"
              >
                <SafeIcon icon={FiHome} className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <Card className="p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiMail} className="h-5 w-5 mr-2" />
              What happens next?
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Confirmation</p>
                  <p>We've sent a confirmation email to <strong>{customerEmail}</strong> with your access link.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Document Access</p>
                  <p>You now have edit permissions for the Google Doc. Click "Open Document" above to access it.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lifetime Access</p>
                  <p>Your access to this document is permanent. Bookmark the link for future reference.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:support@docupay.com" className="text-primary-600 hover:text-primary-500">
                support@docupay.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;