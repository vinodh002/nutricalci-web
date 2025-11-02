// src/components/AppFooter.jsx

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaYoutube, FaGooglePlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AppFooter = () => {
    // Placeholder links - replace with your actual links
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.vinodh2.doc";
    const youtubeLink = "https://www.youtube.com/@Vk2Studios"; 

    return (
        <footer className="mt-5 border-top pt-4 pb-3 bg-light">
            <Container style={{ maxWidth: '1200px' }}>
                <Row className="align-items-center justify-content-between">
                    
                    {/* 🛑 CRITICAL FIX: REQUIRED PAGES Links */}
                    <Col xs={12} md={4} className="text-center text-md-start mb-3 mb-md-0">
                        <p className="text-muted mb-0 small">Developed by VK2</p>
                    </Col>

                    {/* Social/App Links */}
                    <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                        <a href={playStoreLink} target="_blank" rel="noopener noreferrer" 
                            className="text-success mx-3 fs-4 transition-opacity hover-opacity-75" 
                            aria-label="Download on Google Play">
                            <FaGooglePlay />
                        </a>
                        <a href={youtubeLink} target="_blank" rel="noopener noreferrer" 
                            className="text-danger mx-3 fs-4 transition-opacity hover-opacity-75" 
                            aria-label="Watch video on YouTube">
                            <FaYoutube />
                        </a>
                    </Col>

                    {/* Copyright/Project Info */}
                    <Col xs={12} md={4} className="text-center text-md-end">
                        <p className="text-muted mb-0 small">© {new Date().getFullYear()} Nutri Calci</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default AppFooter;