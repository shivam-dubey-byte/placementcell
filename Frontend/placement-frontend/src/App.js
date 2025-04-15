import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Body from "./Body";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FeaturesPage from "./pages/FeaturesPage";
import FAQsPage from "./pages/FAQsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage"; // Add a 404 page


// Lazy load the DashboardPage for better performance
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

function App() {
  // Example: Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Body />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Protected Routes */}
          <Route path="/dashboard/*" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} />


          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;