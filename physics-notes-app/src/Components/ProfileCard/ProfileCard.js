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

export default class ProfileCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            updatedFirstName: '',
            updatedLastName: '',
            updatedIntake: 0,
            updatedIsPrivate: true,

            userHasChangedValues: false,
            successfullyChangedValues: false,
            failedToChangeValues: false,

            testsFetched: false,
            tests: [],
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
            graphDataReady: true,

            addingTest: false,
            failedToAddTest: false,
            addTestName: '',
            addTestDate: '',
            addTestAttainedScore: 0,
            addTestMaxScore: 0
        }
    }

    componentDidMount() {

        const { user } = this.props;

        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('intake').value = user.intake;
        document.getElementById('isPrivate').checked = user.isPrivate;

        this.setState({
            updatedFirstName: user.firstName,
            updatedLastName: user.lastName,
            updatedIntake: user.intake,
            updatedIsPrivate: user.isPrivate,
            userHasChangedValues: false
        });

        fetch(`http://localhost:3000/tests/${user.id}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.log(data.message);
                }
                else {
                    const { testObjects } = data;

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

                    this.setState({ tests: testArray, testsFetched: true }, () => {
                        this.createGraph(testArray);
                    });

                }
            })

    }

    updateInputFirstName = event => this.setState({ updatedFirstName: event.target.value, userHasChangedValues: true });
    updateInputLastName = event => this.setState({ updatedLastName: event.target.value, userHasChangedValues: true });
    updateInputIntake = event => this.setState({ updatedIntake: event.target.value, userHasChangedValues: true });
    updateInputIsPrivate = event => this.setState({ updatedIsPrivate: event.target.checked, userHasChangedValues: true });

    updateAddTestName = event => this.setState({ addTestName: event.target.value });
    updateAddTestDate = event => this.setState({ addTestDate: event.target.value });
    updateAddTestAttainedScore = event => this.setState({ addTestAttainedScore: event.target.value });
    updateAddTestMaxScore = event => this.setState({ addTestMaxScore: event.target.value });

    updateUserPersonalDetails = () => {
        const { user } = this.props;

        const {
            updatedFirstName,
            updatedLastName,
            updatedIntake,
            updatedIsPrivate
        } = this.state;
        console.log(updatedIsPrivate)

        fetch('http://localhost:3000/users', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: user.id,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                intake: updatedIntake,
                isPrivate: updatedIsPrivate 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({ successfullyChangedValues: true, failedToChangeValues: false });
            }
            else {
                this.setState({ failedToChangeValues: true })
            }
        })
        .catch(err => this.setState({ failedToChangeValues: true }));
    }

    addTest = () => {

        const { user } = this.props;

        const { 
            addTestName,
            addTestDate,
            addTestAttainedScore,
            addTestMaxScore
        } = this.state;

        fetch('http://localhost:3000/tests', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: user.id,
                testName: addTestName,
                testDate: addTestDate,
                attainedScore: addTestAttainedScore,
                maxScore: addTestMaxScore
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                this.setState({
                    failedToAddTest: true
                }, () => console.log(data.message))
            }
            else {
                this.setState(state => {

                    const testObject = data.testObject[0];
                    const newTest = new Test(
                        testObject.test_id,
                        testObject.test_name,
                        testObject.user_id,
                        testObject.test_date,
                        testObject.attained_score,
                        testObject.max_score
                    );

                    const tempTestArray = state.tests.concat([newTest]);

                    this.createGraph(tempTestArray);

                    return({
                        tests: tempTestArray,
                        addingTest: false,
                        failedToAddTest: false
                    });
                })
            }
        })
        .catch(err => this.setState({
            failedToAddTest: true
        }, () => console.log(err)));

    }

    createGraph = tests => {
        this.setState(state => {

            const orderedTests = tests.sort((test1, test2) => test1.testDate - test2.testDate);
            console.log(orderedTests)

            const dates = orderedTests.map(test => test.getParsedDate())
            const percentages = orderedTests.map(test => test.getRoundedPercentage());

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

    render() {

        const { user } = this.props;
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