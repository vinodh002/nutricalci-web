// src/pages/PrivacyPolicy.jsx (UPDATED - Removing ** and adjusting data storage info)

import React from "react";
import Container from "react-bootstrap/Container";
import AppFooter from "../components/AppFooter";
import AppNavbar from "../components/AppNavbar"; // Added for consistent structure
import AdBanner728 from "../Ads/AdBanner728";

const PrivacyPolicyPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />     {" "}
      <Container className="my-5 flex-grow-1" style={{ maxWidth: "900px" }}>
               {" "}
        <h1 className="text-info mb-4">Privacy Policy for Nutri Calci</h1>     
          <p className="text-muted small">Effective Date: November 2, 2025</p>
        {/* --- Section 1: Data Handling (Crucial) --- */}       {" "}
        <h2 className="h4 mt-4 text-primary">
          1. Information We Collect and Store
        </h2>
               {" "}
        <p>
                    <span className="fw-bold">Non-Personal Data Input:</span> We
          process the nutritional information you input into the calculator
          (e.g., Age, Gender, Weight, Food Items, Serving Sizes).{" "}
          <span className="fw-bold text-danger">
            This data is processed locally within your browser and is NOT stored
            on our servers, nor is it linked to any personal identifier.
          </span>
                 {" "}
        </p>
        <p>
          <span className="fw-bold">Nutritional Data:</span> The food item
          database and nutritional guidelines used by the calculator are
          accessed from our secure backend services. This is read-only data and
          does not involve the collection of user personal information.
        </p>
               {" "}
        <p>
                   {" "}
          <span className="fw-bold">Usage Data (Google Analytics):</span> We use
          standard Google Analytics to collect non-identifying data like page
          views, session duration, and device type to help us improve the
          application's performance and design.        {" "}
        </p>
        {/* --- Section 2: Advertising (AdSense Requirement) --- */}       {" "}
        <h2 className="h4 mt-4 text-primary">
          2. Third-Party Advertising (Google AdSense)
        </h2>
               {" "}
        <p>
                    We use Google AdSense to serve advertisements on our
          website. Google, as a third-party vendor, uses cookies to serve ads
          based on a user's prior visits to this and other websites (known as
          the <span className="fw-bold">DART cookie</span>). You may opt out of
          the use of the DART cookie by visiting the Google Ad and Content
          Network Privacy Policy.        {" "}
        </p>
        {/* --- Section 3: Consent --- */}       {" "}
        <h2 className="h4 mt-4 text-primary">3. Your Consent</h2>       {" "}
        <p>
                    By using our website, you hereby consent to our Privacy
          Policy and agree to its terms.        {" "}
        </p>
             {" "}
      </Container>
      <AdBanner728/>
            <AppFooter />   {" "}
    </div>
  );
};

export default PrivacyPolicyPage;
