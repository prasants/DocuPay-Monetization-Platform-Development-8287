import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { documentService } from '../../services/documentService';
import { purchaseService } from '../../services/purchaseService';
import { useStripe } from '../../contexts/StripeContext';

const { FiFileText, FiDollarSign, FiUser, FiMail, FiEye, FiShoppingCart, FiStar, FiArrowRight, FiCheckCircle, FiExternalLink } = FiIcons;

const DocumentListing = () => {
  const { shareId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { processPayment } = useStripe();

  const customerEmail = watch('email');

  useEffect(() => {
    if (shareId) {
      loadDocument();
    }
  }, [shareId]);

  // Check if customer already purchased when email is entered
  useEffect(() => {
    if (document && customerEmail && customerEmail.includes('@')) {
      checkExistingPurchase();
    }
  }, [document, customerEmail]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const result = await documentService.getDocumentByShareId(shareId);
      
      if (result.success) {
        setDocument(result.data);
        // Increment views
        await documentService.incrementViews(result.data.id);
      } else {
        toast.error('Document not found');
      }
    } catch (error) {
      toast.error('Error loading document');
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingPurchase = async () => {
    try {
      const result = await purchaseService.checkExistingPurchase(document.id, customerEmail);
      if (result.success) {
        setAlreadyPurchased(result.hasPurchased);
      }
    } catch (error) {
      console.error('Error checking existing purchase:', error);
    }
  };

  const handlePurchase = async (data) => {
    if (alreadyPurchased) {
      toast.error('You have already purchased this document');
      return;
    }

    setPurchasing(true);
    try {
      // Calculate fees (5% platform fee)
      const amount = document.price;
      const platformFee = amount * 0.05;
      const creatorEarnings = amount - platformFee;

      // Create purchase record
      const purchaseData = {
        document_id: document.id,
        creator_user_id: document.user_id,
        customer_email: data.email,
        customer_name: data.name || data.email.split('@')[0],
        amount: amount,
        platform_fee: platformFee,
        creator_earnings: creatorEarnings,
        status: 'pending'
      };

      const purchaseResult = await purchaseService.createPurchase(purchaseData);
      
      if (!purchaseResult.success) {
        toast.error('Failed to create purchase record');
        return;
      }

      // Process payment
      const paymentResult = await processPayment({
        amount: amount * 100, // Convert to cents
        documentId: document.id,
        customerEmail: data.email,
        purchaseId: purchaseResult.data.id
      });

      if (paymentResult.success) {
        // Update purchase status
        await purchaseService.updatePurchaseStatus(
          purchaseResult.data.id, 
          'completed', 
          paymentResult.paymentId
        );

        // Create document access record
        await purchaseService.createDocumentAccess({
          document_id: document.id,
          purchase_id: purchaseResult.data.id,
          customer_email: data.email,
          access_level: 'edit'
        });

        // Redirect to success page
        window.location.href = `/#/success?doc=${document.share_id}&email=${data.email}`;
      } else {
        // Update purchase status to failed
        await purchaseService.updatePurchaseStatus(purchaseResult.data.id, 'failed');
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Purchase error:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiFileText} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document not found</h2>
          <p className="text-gray-600">The document you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Document Header */}
              <div className="mb-8">
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
                  {document.cover_image_url ? (
                    <img
                      src={document.cover_image_url}
                      alt={document.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                      <SafeIcon icon={FiFileText} className="h-24 w-24 text-primary-400" />
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {document.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiEye} className="h-4 w-4" />
                    <span>{document.views || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiShoppingCart} className="h-4 w-4" />
                    <span>{document.sales || 0} sales</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiUser} className="h-4 w-4" />
                    <span>by {document.user_profile_docupay2024?.display_name || 'Creator'}</span>
                  </div>
                </div>
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About This Document
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {document.description}
                </p>
              </Card>

              {/* Preview */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Preview
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-primary-500">
                  <p className="text-gray-700 leading-relaxed">
                    {document.preview_content || `This is a preview of "${document.title}". Purchase to access the full document with detailed content and examples.`}
                  </p>
                  <div className="mt-4 text-center">
                    <p className="text-gray-500 italic">
                      Purchase to unlock the full document...
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-8"
            >
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {formatCurrency(document.price)}
                  </div>
                  <p className="text-gray-600">One-time purchase</p>
                </div>

                {alreadyPurchased ? (
                  <div className="text-center">
                    <SafeIcon icon={FiCheckCircle} className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-700 font-medium mb-4">
                      You've already purchased this document
                    </p>
                    <Button
                      onClick={() => window.open(document.google_doc_url, '_blank')}
                      className="w-full"
                      size="lg"
                    >
                      <SafeIcon icon={FiExternalLink} className="h-5 w-5 mr-2" />
                      Open Document
                    </Button>
                  </div>
                ) : !showPurchaseForm ? (
                  <Button
                    onClick={() => setShowPurchaseForm(true)}
                    className="w-full mb-4"
                    size="lg"
                  >
                    Purchase Access
                    <SafeIcon icon={FiArrowRight} className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit(handlePurchase)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name (optional)
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      loading={purchasing}
                      className="w-full"
                      size="lg"
                      disabled={alreadyPurchased}
                    >
                      {purchasing ? 'Processing...' : 'Complete Purchase'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => setShowPurchaseForm(false)}
                      className="w-full text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </form>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">What you'll get:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <SafeIcon icon={FiFileText} className="h-4 w-4 text-green-500 mr-2" />
                      Full access to Google Doc
                    </li>
                    <li className="flex items-center">
                      <SafeIcon icon={FiUser} className="h-4 w-4 text-green-500 mr-2" />
                      Edit permissions granted
                    </li>
                    <li className="flex items-center">
                      <SafeIcon icon={FiMail} className="h-4 w-4 text-green-500 mr-2" />
                      Email with access link
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentListing;