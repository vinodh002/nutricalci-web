// src/components/AppNavbar.jsx (NEW FILE - Professional Navigation Bar)

import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const AppNavbar = () => {
    return (
        // Use bg-white or bg-light for a clean, professional look
        <Navbar bg="white" expand="md" className="shadow-sm border-bottom py-2">
            <Container style={{ maxWidth: '1200px' }}>
                
                {/* BRANDING (Left side) */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <h1 className="h3 fw-bold text-success mb-0 me-2">
                        Nutri Calci <span style={{ fontSize: "0.8em" }}>🩺</span>
                    </h1>
                    {/* Optional Tagline on desktop */}
                    <span className="text-muted small d-none d-sm-block">
                        | NIN Calculator
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                {/* LINKS (Right side, collapses on mobile) */}
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="ms-auto">
                        
                        <Nav.Link as={Link} to="/" className="text-dark fw-medium mx-1">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about" className="text-dark fw-medium mx-1">
                            About Us
                        </Nav.Link>
                        <Nav.Link as={Link} to="/privacy" className="text-dark fw-medium mx-1">
                            Privacy Policy
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="text-dark fw-medium mx-1">
                            Contact
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;