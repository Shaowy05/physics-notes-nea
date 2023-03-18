// Importing React library
import React from "react";

// Importing Bootstrap React Components
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Importing Styling for Navigation Bar
import './NavigationBar.css';

// Inheriting from React.Component
export default class NavigationBar extends React.Component {

    // Render method for Navigation Bar
    render() {

        // Destructuring Props for easier access
        const { signedIn, changeRoute } = this.props;

        return(
            <div className="NavigationBar">

                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand>Physics Notes</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            {
                                signedIn === true ?
                                    <Nav className="me-auto">
                                        <Nav.Link onClick={() => changeRoute('index')}>Index</Nav.Link>
                                        <Nav.Link className="justify-content-end" onClick={() => changeRoute('profile')}>
                                            <span className="material-symbols-outlined">
                                                account_circle
                                            </span>
                                        </Nav.Link>
                                    </Nav>
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