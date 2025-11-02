// src/pages/About.jsx (UPDATED for clean formatting)

import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import AppFooter from "../components/AppFooter";
import AppNavbar from "../components/AppNavbar"; // Added for consistent structure
import AdBanner728 from "../Ads/AdBanner728";

const AboutPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />     {" "}
      <Container className="my-5 flex-grow-1" style={{ maxWidth: "900px" }}>
                <h1 className="text-success mb-4">About Nutri Calci 🩺</h1>     
                 {" "}
        <Card className="shadow p-4 mb-4">
                   {" "}
          <h2 className="h4 text-primary">Our Mission and Authority</h2>       
           {" "}
          <p>
                        <span className="fw-bold">Nutri Calci</span> was
            developed by a team of software professionals and health enthusiasts
            working alongside medical consultants to bridge the gap between
            complex nutritional data and practical daily tracking. Our core
            mission is to provide an{" "}
            <span className="fw-bold">
              accurate, trustworthy, and simple tool
            </span>{" "}
            for tracking and planning meals.          {" "}
          </p>
                   {" "}
          <p>
                        The foundation of our calculator is the{" "}
            <span className="fw-semibold">
              official Recommended Dietary Allowances (RDA) and Estimated
              Average Requirements (EAR)
            </span>{" "}
            published by the{" "}
            <span className="fw-bold">
              National Institute of Nutrition (NIN), India
            </span>
            . We are committed to updating our calculation logic immediately
            following any new NIN publication to ensure data integrity and
            clinical relevance.          {" "}
          </p>
                   {" "}
          <p>
                        Our current food item database is based on commonly
            consumed items across India, with nutrient values cross-referenced
            with official food composition tables.          {" "}
          </p>
                 {" "}
        </Card>
                       {" "}
        <Card className="shadow p-4">
                    <h2 className="h4 text-primary">Disclaimer on Use</h2>     
             {" "}
          <p>
                        Please note that while our data sources are
            authoritative, Nutri Calci is a{" "}
            <span className="fw-bold">reference tool only</span>. It is not a
            substitute for professional medical advice, diagnosis, or treatment.{" "}
            <span className="fw-semibold">
              Always seek the advice of a qualified health provider, physician,
              or nutritionist
            </span>{" "}
            with any questions you may have regarding a medical condition or
            dietary changes.          {" "}
          </p>
                 {" "}
        </Card>
             {" "}
      </Container>
      <AdBanner728/>
            <AppFooter />   {" "}
    </div>
  );
};

export default AboutPage;
