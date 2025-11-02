// src/main.jsx (UPDATED)

import React from 'react';
import ReactDOM from 'react-dom/client';
// 🛑 CRITICAL FIX: Import necessary routing components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';


import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AboutPage from './components/About.jsx';
import PrivacyPolicyPage from './components/PrivacyPolicy.jsx';
import ContactPage from './components/Contact.jsx';

// 🛑 IMPORTANT: If your essential pages are still in 'components/', 
// change the paths above (e.g., from './pages/About.jsx' to './components/About.jsx')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🛑 WRAP the entire app in the Router */}
    <BrowserRouter>
      <Routes>
        {/* 1. Main Application/Calculator Route */}
        <Route path="/" element={<App />} />

        {/* 2. Essential Pages Routes (Required for AdSense) */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Optional: 404 Page (Highly Recommended) */}
        <Route path="*" element={
          <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
              <h1>404 Not Found 😞</h1>
              <p>The page you are looking for does not exist.</p>
              <a href="/" className="btn btn-primary">Go to Home</a>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);