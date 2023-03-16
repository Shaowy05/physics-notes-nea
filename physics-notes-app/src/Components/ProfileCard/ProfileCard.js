import React from "react";

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import FormGroup from "react-bootstrap/FormGroup";

import Test from "../../Logic/Test";

import './ProfileCard.css';

// Inheriting from React.Component.
export default class ProfileCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Fields for the user's new information, this will be used in order to update the new information.
            updatedFirstName: '',
            updatedLastName: '',
            updatedIntake: 0,
            updatedIsPrivate: true,

            // Here we have a boolean for if the user has changed their personal information. This is
            // so that the submit button is greyed out if they haven't changed anything.
            userHasChangedValues: false,
            // This is a boolean which is used to show the user a success message and telling them to
            // refresh the page.
            successfullyChangedValues: false,
            // This boolean is used to display an error message if something went wrong when trying
            // to udpate their details.
            failedToChangeValues: false,

            // A boolean for determining if the tests were fetched.
            testsFetched: false,
            // An array to store the tests.
            tests: [],
            // Here we have an object that will be used with the Graph later on, here we store a the
            // label for the graph, the background colour and also an array for the data of the graph.
            // This will be appended to so that the graph can be updated.
            graphData: {
                labels: [],
                datasets: [
                    {
                        label: 'Tests',
                        backgroundColor: '#d3d3d3',
                        data: []
                    }
                ]
            },
            // This boolean is used to dictate whether or not the graph should be displayed or not.
            graphDataReady: true,

            // Here we have some fields for adding a test, along with booleans to show alerts if needed.
            addingTest: false,
            failedToAddTest: false,
            addTestName: '',
            addTestDate: '',
            addTestAttainedScore: 0,
            addTestMaxScore: 0
        }
    }

    // Once the component has mounted we want to all of the user information and store it in the state.
    // We also want to get all of the tests that belong to the user.
    componentDidMount() {

        // Getting the user from the props.
        const { user } = this.props;

        // Here we automatically fill out all of the fields to contain the user's information.
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('intake').value = user.intake;
        document.getElementById('isPrivate').checked = user.isPrivate;

        // Then we add the information to the state as well.
        this.setState({
            updatedFirstName: user.firstName,
            updatedLastName: user.lastName,
            updatedIntake: user.intake,
            updatedIsPrivate: user.isPrivate,
            userHasChangedValues: false
        });

        // Now we get all of the tests. We do this by sending a GET request to the tests endpoint, passing
        // in the user ID as a parameter.
        fetch(`http://localhost:3000/tests/${user.id}`)
            // Converting the JSON response to a Javascript object.
            .then(response => response.json())
            .then(data => {
                // If the request was successful then we log the message to the console.
                if (!data.success) {
                    console.log(data.message);
                }
                // Otherwise...
                else {
                    // Load all of the test information into a constant for easier use.
                    const { testObjects } = data;

                    // Here we use the .map method to iterate over all of the tests. For each of these
                    // tests, we create a new instance of the Test class by passing in all of the relevant
                    // information from the database.
                    const testArray = testObjects.map(testObject => {
                        return new Test(
                            testObject.test_id,
                            testObject.test_name,
                            testObject.user_id,
                            testObject.test_date,
                            testObject.attained_score,
                            testObject.max_score
                        );
                    })

                    // Finally we update the state with the new test information, and set the testsFetched
                    // state to true so that the graph can be displayed. Once the state is finished
                    // updating we can use the createGraph method, passing in the test array, to make
                    // the graph.
                    this.setState({ tests: testArray, testsFetched: true }, () => {
                        this.createGraph(testArray);
                    });
                }
            })
    }

    // Update methods for the user information.
    updateInputFirstName = event => this.setState({ updatedFirstName: event.target.value, userHasChangedValues: true });
    updateInputLastName = event => this.setState({ updatedLastName: event.target.value, userHasChangedValues: true });
    updateInputIntake = event => this.setState({ updatedIntake: event.target.value, userHasChangedValues: true });
    updateInputIsPrivate = event => this.setState({ updatedIsPrivate: event.target.checked, userHasChangedValues: true });

    // Update methods for the test information
    updateAddTestName = event => this.setState({ addTestName: event.target.value });
    updateAddTestDate = event => this.setState({ addTestDate: event.target.value });
    updateAddTestAttainedScore = event => this.setState({ addTestAttainedScore: event.target.value });
    updateAddTestMaxScore = event => this.setState({ addTestMaxScore: event.target.value });

    // Here we have the method for updating the personal details of the user in the backend. This is
    // called if the user presses the submit button.
    updateUserPersonalDetails = () => {
        // First we load the user from the props.
        const { user } = this.props;

        // Now we destructure all of the new information from the state.
        const {
            updatedFirstName,
            updatedLastName,
            updatedIntake,
            updatedIsPrivate
        } = this.state;

        // Then we initiate a PUT request to the users endpoint so that we can change the information.
        fetch('http://localhost:3000/users', {
            method: 'put',
            // Specifying that we are sending the information as JSON in the headers.
            headers: {'Content-Type': 'application/json'},
            // Passing in all of the new information in the body, including the ID of the user so the
            // backend knows who to update.
            body: JSON.stringify({
                userId: user.id,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                intake: updatedIntake,
                isPrivate: updatedIsPrivate 
            })
        })
        // Converting the response from JSON to a Javascript object.
        .then(response => response.json())
        // With this data...
        .then(data => {
            // If the request was successful then we want to update the state so that the user sees
            // the success message, and we also want to wipe any previous errors so we set failedToChangeValues
            // to false.
            if (data.success) {
                this.setState({ successfullyChangedValues: true, failedToChangeValues: false });
            }
            // Otherwise, an error occurred so we display the alert to the user.
            else {
                this.setState({ failedToChangeValues: true })
            }
        })
        // If there was an error at any point during the promise chain then we want update the state
        // so that an error message is displayed to the user.
        .catch(err => this.setState({ failedToChangeValues: true }));
    }

    // This is the method which handles adding a test to the database.
    addTest = () => {

        // Getting the user from the props.
        const { user } = this.props;

        // Loading all of the test information from the state.
        const { 
            addTestName,
            addTestDate,
            addTestAttainedScore,
            addTestMaxScore
        } = this.state;

        // To add the test we initiate a POST request to the tests endpoint in the API.
        fetch('http://localhost:3000/tests', {
            method: 'post',
            // Telling the API that we are sending the information in JSON format.
            headers: {'Content-Type': 'application/json'},
            // Adding the user ID and the test information in the body of the request.
            body: JSON.stringify({
                userId: user.id,
                testName: addTestName,
                testDate: addTestDate,
                attainedScore: addTestAttainedScore,
                maxScore: addTestMaxScore
            })
        })
        // Converting the JSON response to Javascript.
        .then(response => response.json())
        .then(data => {
            // If the request was not successful then we update the state so that an alert appears.
            if (!data.success) {
                this.setState({
                    failedToAddTest: true
                }, () => console.log(data.message))
            }
            // Otherwise, we want to add this new test to the test array so that the graph can reflect
            // this new information.
            else {
                this.setState(state => {

                    // First we get the test information back from the database.
                    const testObject = data.testObject[0];
                    // Then we create a new instance of the Test class with the received information.
                    const newTest = new Test(
                        testObject.test_id,
                        testObject.test_name,
                        testObject.user_id,
                        testObject.test_date,
                        testObject.attained_score,
                        testObject.max_score
                    );

                    // Here we create a temporary test array by concatenating the new test onto the
                    // tests array in the state.
                    const tempTestArray = state.tests.concat([newTest]);

                    // Now we run the createGraph method with this new array so that the graph contains
                    // the new information.
                    this.createGraph(tempTestArray);

                    // Finally we update the state with the new information.
                    return({
                        tests: tempTestArray,
                        addingTest: false,
                        failedToAddTest: false
                    });
                })
            }
        })
        // If there was an error at any point then we update the state so that an error alert appears
        // to the user.
        .catch(err => this.setState({
            failedToAddTest: true
        }, () => console.log(err)));

    }

    // This is the method responsible for creating a graph with a given set of tests.
    createGraph = tests => {
        this.setState(state => {

            // First we order the tests by date. To do this we compare the dates using the '-' operator
            // on the dates, a feature in Javascript which compares the milliseconds elapsed since a
            // fixed date.
            const orderedTests = tests.sort((test1, test2) => test1.testDate - test2.testDate);

            // Now we get all the dates so that we can use them as the titles for the tests. Here we
            // parse them using the getParsedDate method on the Test class to make them easier to read.
            const dates = orderedTests.map(test => test.getParsedDate())
            // Then we get the percentages using the getRoundedPercentage method on the Test class.
            const percentages = orderedTests.map(test => test.getRoundedPercentage());

            // Finally we update the state with this new graph data.
            return ({
                graphData: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Tests',
                            backgroundColor: '#d3d3d3',
                            data: percentages 
                        }
                    ]
                }
            })
        })
    }

    // The render method for the Profile Card.
    render() {

        // Getting the user from the props.
        const { user } = this.props;
        // Grabbing all of the relevant booleans and arrays for rendering the component.
        const {
            userHasChangedValues,
            successfullyChangedValues,
            tests,
            testsFetched,
            addingTest,
            failedToAddTest,
            graphDataReady,
            graphData
        } = this.state;
        // Getting the current date.
        const currentDate = new Date();

        return (
            <div>
                <script
                    src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
                </script>
                <Container>
                    <Row className={'d-flex justify-content-center'}>
                    <Col md={8} lg={8} xs={12}>
                        {
                            successfullyChangedValues &&
                            <Alert variant={'success'}>
                                Successfully updated personal details. Refresh to apply changes
                            </Alert>
                        }
                        <Card className={'shadow'}>
                            <Card.Header style={{ textAlign: 'center' }}>
                                {user.getFullName()}'s Profile
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Update Personal Information</Card.Title>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control id={'firstName'} onChange={this.updateInputFirstName} />
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control id={'lastName'} onChange={this.updateInputLastName} />
                                <Form.Label>Intake</Form.Label>
                                <Form.Control min={2016} max={currentDate.getFullYear()} id={'intake'} onChange={this.updateInputIntake} />
                                <Form.Label>Private</Form.Label>
                                <Form.Check id={'isPrivate'} onChange={this.updateInputIsPrivate} />
                                <Button disabled={!userHasChangedValues}
                                    style={{ marginTop: '5px', marginBottom: '5px' }} 
                                    onClick={() => this.updateUserPersonalDetails()}
                                >Submit Details</Button>

                                {
                                    testsFetched === false ?
                                    <div className={'centralise'}>
                                        <h3>Getting your Tests</h3>
                                        <div className={'loader'}></div>
                                    </div>
                                    :
                                    <div>
                                        <Card.Title>Tests and Assessments</Card.Title>
                                        <Table responsive='md'>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Date</th>
                                                    <th>Attainment</th>
                                                    <th>Maximum</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    tests.map((test, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{test.name}</td>
                                                                <td>{test.getParsedDate()}</td>
                                                                <td>{test.attainedScore}</td>
                                                                <td>{test.maxScore}</td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        {
                                            addingTest === false ?
                                            <Button onClick={() => this.setState({
                                                addingTest: true
                                            })}>Add Test</Button>
                                            :
                                            <Card style={{ padding: '5px' }}>
                                                <Form.Label>Test Name</Form.Label>
                                                <Form.Control onChange={this.updateAddTestName} />
                                                <Form.Label>Test Date</Form.Label>
                                                <FormGroup>
                                                <input onChange={this.updateAddTestDate} type={'date'}/>
                                                </FormGroup>
                                                <Form.Label>Attained Score</Form.Label>
                                                <FormGroup>
                                                <input onChange={this.updateAddTestAttainedScore} type={'number'} min={0} />
                                                </FormGroup>
                                                <Form.Label>Maximum Score</Form.Label>
                                                <FormGroup>
                                                <input onChange={this.updateAddTestMaxScore} type={'number'} min={0} />
                                                </FormGroup>
                                                <Button onClick={this.addTest}
                                                    variant={'success'}
                                                    style={{ marginTop: '5px' }} 
                                                >Submit</Button>
                                                <Button onClick={() => this.setState({ addingTest: false })}
                                                    variant={'danger'}
                                                    style={{ marginTop: '5px' }} 
                                                >Cancel</Button>
                                                {
                                                    failedToAddTest &&
                                                    <Alert variant={'danger'} style={{ marginTop: '5px' }}>Failed To Add Test</Alert>
                                                }
                                            </Card>
                                        }
                                        <Card.Title>Graph of Performance</Card.Title>
                                        {
                                            graphDataReady &&
                                            <Line
                                                data={graphData}
                                                options={{
                                                    scales: {
                                                        y: {
                                                           max: 100,
                                                           min: 0,
                                                           ticks: {
                                                            stepSize: 5
                                                           }
                                                        }
                                                    }
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            />
                                        }
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}