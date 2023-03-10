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

import User from '../../Logic/User';
import Teacher from '../../Logic/Teacher';

// The Account Card Component - A form for letting the user sign in and also register
export default class AccountCard extends React.Component {

    // Creating a state to hold the user input
    constructor(props) {
        super(props);

        // Creating the state
        this.state = {

            // A property which notifies the component if the user has just failed to
            // register, in which case a notification should appear.
            failedToRegister: false,

            // A property which notifies the component if the user has just failed to 
            // sign in, so that a notification appears.
            failedToSignIn: false,

            // For both sign in and register
            inputEmail: '',
            inputPassword: '',

            // Exclusively for register
            inputFirstName: '',
            inputLastName: '',
            inputIntake: '',

        }

    }

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
    validateUser = event => {

        // Here we retrieve the email and password from the state.
        const { inputEmail, inputPassword } = this.state;

        // Then we communicate with the backend to login to the application with a POST request.
        fetch('http://localhost:3000/logins', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            // Passing in the information
            body: JSON.stringify({
                email: inputEmail,
                password: inputPassword
            })
        })
        // Converting the response from JSON to a Javascript object.
        .then(response => response.json())
        .then(userObject => {

            // Declare a user variable, this will be updated and eventually loaded into the state of
            // the app.js file using the loadUser prop.
            let user;

            // If the message from the API has a success value of undefined, then a failure occured
            // in the backend and so we set the failedToSignIn property in the state to be true, hence
            // updating the rendering function to alert the user that either the credentials they entered
            // are wrong, or the API is not functionin properly.
            if (userObject.success !== undefined) {
                this.setState({ failedToSignIn: true });
            }

            // Otherwise, a good response was received and we can continue with the function.
            else {
                // Here we store the user values loaded from the API into an array so that we can easily
                // create the User or the Teacher instance. We do this by using the built in Object.values
                // function.
                const userObjectValues = Object.values(userObject);

                // Using these regex strings to find out which type of user they are based on their
                // email.
                const reStudentEmail = /\w{2}\.\w+@ecclesbourne.derbyshire.sch.uk/;
                const reTeacherEmail = /\w+@ecclesbourne.derbyshire.sch.uk/;

                // Testing the email against the regex expressions gives us this conditional statement.
                // If the email matches the student email, then we add a new instance of user.
                if (reStudentEmail.test(inputEmail)) {
                    // Instantiating the user variable declared earlier with an instance of the User
                    // class, passing in the values returned by the API.
                    user = new User(
                        userObjectValues[0],
                        userObjectValues[1],
                        userObjectValues[2],
                        userObjectValues[4],
                        userObjectValues[3],
                        userObjectValues[5]
                    );
                }
                // Otherwise if the email matched the teacher's email format, then we must initialise
                // the user variable to an instance of the Teacher class instead.
                else if (reTeacherEmail.test(inputEmail)) {
                    user = new Teacher(
                        userObjectValues[0],
                        userObjectValues[1],
                        userObjectValues[2],
                        userObjectValues[3],
                        userObjectValues[4],
                        userObjectValues[5]
                    );
                }
                // Otherwise, the backend API did not properly perform the regex checks, so we throw
                // error to instigate a fix on the backend.
                else {
                    throw new Error('Invalid email passed regex checks in backend');
                }

                // Finally, we return a new promise onto the next stage of the promise chain. Here,
                // the data we are passing on is the user variable, so that it can be used in the next
                // stage.
                return new Promise((resolve, reject) => {
                    resolve(user);
                    reject('Failed to fetch user from database');
                })
            }
        })
        .then(user => {
            // Here we say that if the user is an instance of the User class, then we need to fetch
            // the votes for that given user.
            if (user instanceof User) {
                // Here we perform the GET request to the backend, asking for the votes for this user.
                // As you can see we pass in the id of the user as the parameter for the URL.
                fetch(`http://localhost:3000/votes/${user.id}`)
                // Convert the response from a JSON file to a Javascript object.
                .then(response => response.json())
                .then(data => {
                    // If the API does not respond with a success value of true then we throw an error
                    // as there was a failure to retrieve the user.
                    if (!data.success) {
                        throw new Error('Failed to get votes for user');
                    }
                    // For each of the upvote IDs passed in the response, we want to update the array
                    // of IDs in the user variable. This is so that any voting done in the forums for 
                    // this user can be rendered.
                    data.upvoteIds.forEach(upvoteId => user.updateUpvoteResponseIds(upvoteId.response_id));
                    // We do the same for any downvotes.
                    data.downvoteIds.forEach(downvoteId => user.updateDownvoteResponseIds(downvoteId.response_id));

                    // Using the loadUser function passed in as a prop to add this user instance to
                    // the state of the App. See app.js for the definition of this function.
                    this.props.loadUser(user);

                    // Return out of the function and use the changeRoute prop to go to the index page.
                    return this.props.changeRoute('index');

                })
            }
        })
        // If there were any errors, log to console
        .catch(err => console.log(err));
    }

    // Registering the user on form submit
    registerUser = event => {
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
            console.log(successObject);
            if (successObject.success) {
                this.props.changeRoute('signin');
            }
            else {
                this.setState({ failedToRegister: true });
            }
        })
        .catch(err => console.log('Failure during registration'))
    }

    // Render Method for AccountCard
    render() {

        // Grabbing current for register card
        const currentDate = new Date()

        // Destructuring props for easier access
        const { type, changeRoute } = this.props;

        // Destructuring the state
        const { failedToRegister, failedToSignIn } = this.state;

        // Returning the Account Card
        return (
            <div className="AccountCard">

                <Container>
                    <Row className="vh-90 d-flex justify-content-center">
                    <Col md={8} lg={6} xs={12}>
                        <Card className="shadow">
                        <Card.Body>
                            {
                                failedToRegister &&
                                <Alert variant='danger'>Failed to Register New User - Please make sure that the email is registered with the school</Alert>
                            }
                            {
                                failedToSignIn &&
                                <Alert variant='danger'>Failed to Sign In - Are your Credentials correct? </Alert>
                            }
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
                                    } variant="primary">
                                    { type === 'signin' ? 'Sign In' : 'Register'}
                                    </Button>
                                </div>
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