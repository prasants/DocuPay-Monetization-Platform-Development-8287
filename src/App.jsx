import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { StripeProvider } from './contexts/StripeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreatorDashboard from './pages/creator/Dashboard';
import AddDocument from './pages/creator/AddDocument';
import DocumentSettings from './pages/creator/DocumentSettings';
import Analytics from './pages/creator/Analytics';
import DocumentListing from './pages/customer/DocumentListing';
import PurchaseSuccess from './pages/customer/PurchaseSuccess';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/doc/:id" element={<DocumentListing />} />
              <Route path="/success" element={<PurchaseSuccess />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <CreatorDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/add-document" element={
                <ProtectedRoute>
                  <AddDocument />
                </ProtectedRoute>
              } />
              
              <Route path="/document/:id/settings" element={
                <ProtectedRoute>
                  <DocumentSettings />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;