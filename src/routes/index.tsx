import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import page components
import HomePage from '../pages/Index.tsx';
import ProductListingPage from '../pages/ProductListing.tsx';
import ProductDetailPage from '../pages/ProductDetail.tsx';
import LoginPage from '../pages/Login.tsx';
import SignupPage from '../pages/Signup.tsx';
import CartPage from '../pages/Cart.tsx';
import CheckoutPage from '../pages/Checkout.tsx';
import { UserProfile as UserProfilePage } from '../pages/UserProfile.tsx';
import NotFoundPage from '../pages/NotFound.tsx';

// Import ProtectedRoute component
import { ProtectedRoute } from '../components/ProtectedRoute.tsx';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
