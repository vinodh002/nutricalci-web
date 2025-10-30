// src/components/AppFooter.jsx

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaYoutube, FaGooglePlay } from 'react-icons/fa';

const AppFooter = () => {
  // Placeholder links - replace with your actual links
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.vinodh2.doc";
  const youtubeLink = "https://www.youtube.com/@Vk2Studios"; 

  return (
    <footer className="mt-5 border-top pt-4 pb-3 bg-light">
      <Container style={{ maxWidth: '1200px' }}>
        <Row className="align-items-center justify-content-between">
          
          {/* Developed By */}
          <Col xs={12} md={4} className="text-center text-md-start mb-2 mb-md-0">
            <p className="text-muted mb-0 small">Developed by VK2</p>
          </Col>

          <Col xs={12} md={4} className="text-center">
            <a href={playStoreLink} target="_blank" rel="noopener noreferrer" 
               className="text-success mx-3 fs-3 transition-opacity hover-opacity-75" 
               aria-label="Download on Google Play">
              <FaGooglePlay />
            </a>
            <a href={youtubeLink} target="_blank" rel="noopener noreferrer" 
               className="text-danger mx-3 fs-3 transition-opacity hover-opacity-75" 
               aria-label="Watch video on YouTube">
              <FaYoutube />
            </a>
          </Col>

          {/* Project Info (Optional) */}
          <Col xs={12} md={4} className="text-center text-md-end mt-2 mt-md-0">
            <p className="text-muted mb-0 small">Nutri Calci</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;