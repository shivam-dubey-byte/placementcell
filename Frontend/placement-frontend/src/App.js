import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Body from "./Body";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // Import Forgot Password Page
import FeaturesPage from "./pages/FeaturesPage";
import DashboardPage from "./pages/DashboardPage";
import FAQsPage from "./pages/FAQsPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Added Route */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
