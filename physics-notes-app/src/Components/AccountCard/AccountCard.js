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

    // Creating a state to hold the user input
    constructor(props) {
        super(props);

        // Creating the state
        this.state = {
            inputEmail: '',
            inputPassword: ''
        }

    }

    // Methods to update the state during user input
    updateInputEmail = (event) => {
        return this.setState({ inputEmail: event.target.value });
    }

    updateInputPassword = (event) => {
        return this.setState({ inputPassword: event.target.value });
    }

    // Validating the user on form submit
    validateUser = (event) => {
        //NOTE: USING 'john@hotmail.com' AND 'pass' AS TEMPLATE INFO
        if (this.state.inputEmail === 'kl.jdoe@ecclesbourne.derbyshire.sch.uk' && this.state.inputPassword === '91389') {
            this.props.loadUser({
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                schoolEmail: 'kl.jdoe@ecclesbourne.derbyshire.sch.uk',
                role: 'student',
                intake: '2016'
            })
            return this.props.changeRoute('index');
        }
        else {
            console.log('Incorrect Credentials');
            return null
        }
    }

    // Render Method for AccountCard
    render() {

        // Destructuring props for easier access
        const { type, changeRoute } = this.props;

        // Returning the Account Card
        return (
            <div className="AccountCard">
                <Container>
                    <Row className="vh-90 d-flex justify-content-center">
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
                                    <Form.Control onChange={this.updateInputEmail} type="email" placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={this.updateInputPassword} type="password" placeholder="Password" />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button onClick={this.validateUser} variant="primary" type="submit">
                                    { type === 'signin' ? 'Sign In' : 'Register'}
                                    </Button>
                                </div>
                                </Form>
                                <div className="mt-3">
                                <p className="mb-0  text-center">
                                    Don't have an account?{" "}
                                    <a className="text-primary fw-bold"
                                        onClick={() => changeRoute('register')}>
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