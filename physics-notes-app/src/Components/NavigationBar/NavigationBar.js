// Importing React library
import React from "react";

// Importing Bootstrap React Components
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


// The Navigation Bar Component - An easy way for users to navigate the site
export default class NavigationBar extends React.Component {

    // Render method for Navigation Bar
    render() {

        // Returning the Navigation Bar Component
        return(
            // The div element surrounding the
            // Navigation Bar Component
            <div className="NavigationBar">
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand>Physics Notes</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link>Index</Nav.Link>
                                <Nav.Link>Profile</Nav.Link>
                                <Nav.Link>Messaging</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }

}