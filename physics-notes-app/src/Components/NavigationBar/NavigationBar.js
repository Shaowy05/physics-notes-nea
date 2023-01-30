// Importing React library
import React from "react";

// Importing Bootstrap React Components
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Importing Styling for Navigation Bar
import './NavigationBar.css';

// The Navigation Bar Component - An easy way for users to navigate the site
export default class NavigationBar extends React.Component {

    // Render method for Navigation Bar
    render() {

        // Destructuring Props for easier access
        const { signedIn, changeRoute } = this.props;

        // Returning the Navigation Bar Component
        return(
            // The div element surrounding the
            // Navigation Bar Component
            <div className="NavigationBar">

                {/* Using the Navbar Component from Bootstrap */}
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand>Physics Notes</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            {
                                // If the user is signed in display regular Navigation Bar
                                signedIn === true ?
                                    <Nav className="me-auto">
                                        <Nav.Link>Index</Nav.Link>
                                        <Nav.Link className="justify-content-end">
                                            <span className="material-symbols-outlined">
                                                account_circle
                                            </span>
                                        </Nav.Link>
                                    </Nav>
                                // Else display the alternative Navigation Bar
                                :
                                    <Nav className="me-auto">
                                        <Nav.Link onClick={() => changeRoute('signin')}>Sign In</Nav.Link>
                                    </Nav>

                            }
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }

}