// Importing React Libraries
import React from 'react';

// Importing styling
import './AccountCard.css';

// Importing Bootstrap Components
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

// The Account Card Component - A form for letting the user sign in and also register
export default class AccountCard extends React.Component {

    // Render Method for AccountCard
    render() {

        // Destructuring props for easier access
        const { type, updateEmail, updatePassword } = this.props;

        // Returning the Account Card
        return (
            <div className="AccountCard">
                <Container>
                    <Row className="vh-100 d-flex justify-content-center">
                    <Col md={8} lg={6} xs={12}>
                        <Card className="shadow">
                        <Card.Body>
                            <div className="mb-3 mt-md-4">
                            <h2 className="fw-bold mb-2 text-uppercase ">{ 
                                // Changing the Card title based off the route
                                type === 'signin' ? 'Sign In' : 'Register'
                            }</h2>
                            <p className=" mb-5">Please enter your email and password</p>
                            <div className="mb-3">
                                <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className="text-center">
                                    Email address
                                    </Form.Label>
                                    <Form.Control onChange={updateEmail} type="email" placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={updatePassword} type="password" placeholder="Password" />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicCheckbox"
                                >
                                    <p className="small">
                                    <a className="text-primary" href="#!">
                                        Forgot password?
                                    </a>
                                    </p>
                                </Form.Group>
                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                    Login
                                    </Button>
                                </div>
                                </Form>
                                <div className="mt-3">
                                <p className="mb-0  text-center">
                                    Don't have an account?{" "}
                                    <a className="text-primary fw-bold">
                                        Register
                                    </a>
                                </p>
                                </div>
                            </div>
                            </div>
                        </Card.Body>
                        </Card>
                    </Col>
                    </Row>
                </Container>
            </div>
        );

    }

}