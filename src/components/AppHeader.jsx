// src/components/AppHeader.jsx (UPDATED - Branding Only)

import React from 'react';
// Removed Container import as it will be handled by App.jsx

const AppHeader = () => {
    return (
        <header className="text-center mb-4 pt-4 pb-4 bg-light shadow-sm">
            <h1
                className="display-4 fw-bold text-success"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
            >
                Nutri Calci <span style={{ fontSize: "0.8em" }}>🩺</span>
            </h1>
            <p className="lead text-muted mb-0">NIN-Based Daily Needs & Meal Tracker</p>
        </header>
    );
};

export default AppHeader;