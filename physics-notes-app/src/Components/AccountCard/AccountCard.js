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
import Alert from 'react-bootstrap/Alert';

// The Account Card Component - A form for letting the user sign in and also register
export default class AccountCard extends React.Component {

    // Creating a state to hold the user input
    constructor(props) {
        super(props);

        // Creating the state
        this.state = {

            // A property which determines whether or not the user has just registered
            // an account, in which case a notification should appear.
            justRegistered: false,

            // A property which notifies the component if the user has just failed to
            // register, in which case a notification should appear.
            failedToRegister: false,

            // For both sign in and register
            inputEmail: '',
            inputPassword: '',

            // Exclusively for register
            inputFirstName: '',
            inputLastName: '',
            inputIntake: '',

        }

    }

    // Upon registration, change the state of justRegistered
    updateJustRegistered = () => this.setState({ justRegistered: true });

    // Upon failure to register, change the state of failedToRegister
    updateFailedToRegister = () => this.setState({ failedToRegister: true });

    // Methods to update the state during user input
    updateInputEmail = (event) => {
        return this.setState({ inputEmail: event.target.value });
    }
    updateInputPassword = (event) => {
        return this.setState({ inputPassword: event.target.value });
    }
    updateInputFirstName = (event) => {
        return this.setState({ inputFirstName: event.target.value });
    }
    updateInputLastName = (event) => {
        return this.setState({ inputLastName: event.target.value });
    }
    updateInputIntake = (event) => {
        return this.setState({ inputIntake: event.target.value });
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

    // Registering the user on form submit
    registerUser = (event) => {
        // Destructuring the state
        const { inputEmail, inputPassword, inputFirstName, inputLastName, inputIntake } = this.state

        fetch('http://localhost:3000/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: inputEmail,
                password: inputPassword,
                first_name: inputFirstName,
                last_name: inputLastName,
                intake: inputIntake
            })
        })
        .then(response => response.json())
        .then(successObject => {
            if (successObject.success) {
                this.setState({ justRegistered: true });
                this.props.changeRoute('signin');
            }
            else {
                
            }
        })

        // Changing route to index
        return this.props.changeRoute('index');

    }

    // Render Method for AccountCard
    render() {

        // Grabbing current for register card
        const currentDate = new Date()

        // Destructuring props for easier access
        const { type, changeRoute } = this.props;

        // Returning the Account Card
        return (
            <div className="AccountCard">
                <Alert variant='success'>Successfully Registered New User - Please Sign In</Alert>
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
                            <p style={{fontWeight: 'bold'}}>Please enter your {type === 'signin' ? 'Email and Password' : 'Login details'}</p>
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

                                {
                                    // For register card
                                    type === 'register' &&
                                    <div>
                                        <p style={{fontWeight: 'bold'}}>Personal Details</p>

                                        <Form.Group
                                            className="mb-3"
                                        >
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control onChange={this.updateInputFirstName} type="text" placeholder="Enter First Name" />
                                        </Form.Group>

                                        <Form.Group
                                            className="mb-3"
                                        >
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control onChange={this.updateInputLastName} type="text" placeholder="Enter Last Name" />
                                        </Form.Group>

                                        <Form.Group
                                            className="mb-3"
                                        >
                                            <Form.Label>Intake</Form.Label>
                                            <Form.Control onChange={this.updateInputIntake} type="number" min={2016} max={currentDate.getFullYear()} placeholder="Enter Intake" />
                                        </Form.Group>
                                        
                                    </div>

                                }

                                <div className="d-grid">
                                    <Button onClick={
                                        // Changing the function called depending on the type
                                        type === 'signin'
                                        ? this.validateUser
                                        : this.registerUser
                                    } variant="primary" type="submit">
                                    { type === 'signin' ? 'Sign In' : 'Register'}
                                    </Button>
                                </div>
                                {
                                    // Adding other details if the user is logging in
                                }
                                </Form>
                                { 
                                    // Adjusting the link based off of the current route
                                    type==='signin' ? 
                                    <div className="mt-3">
                                    <p className="mb-0  text-center">
                                        Don't have an account?{" "}
                                        <a className="text-primary fw-bold"
                                            onClick={() => changeRoute('register')}>
                                            Register
                                        </a>
                                    </p>
                                    </div> 
                                    :
                                    <div className="mt-3">
                                    <p className="mb-0  text-center">
                                        Already have an account?{" "}
                                        <a className="text-primary fw-bold"
                                            onClick={() => changeRoute('signin')}>
                                            Sign In
                                        </a>
                                    </p>
                                    </div> 
                                }
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