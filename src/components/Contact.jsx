// src/pages/Contact.jsx

import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import AppFooter from '../components/AppFooter';
import AppNavbar from './AppNavbar';
import AdBanner728 from '../Ads/AdBanner728';

const ContactPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
           <AppNavbar />     {" "}
      <Container className="my-5 flex-grow-1" style={{ maxWidth: '900px' }}>
        <h1 className="text-danger mb-4">Contact Nutri Calci</h1>
        
        <Card className="shadow p-4 mb-4">
          <h2 className="h4 text-primary">Questions or Feedback?</h2>
          <p>
            We appreciate your feedback and are here to help with any technical issues or inquiries regarding the nutritional data source.
          </p>

          <h3 className="h5 mt-3">General Inquiries & Support:</h3>
          <p className="fw-bold">
            Email: <a href="mailto:vk2infotech@gmail.com">vk2infotech@gmail.com</a>
          </p>

          <h3 className="h5 mt-3">Data & Guideline Inquiries:</h3>
          <p className="fw-bold">
            Please contact us if you have questions regarding the NIN guidelines used in our calculations.
          </p>
        </Card>
      </Container>
      <AdBanner728/>
      <AppFooter />
    </div>
  );
};

export default ContactPage;