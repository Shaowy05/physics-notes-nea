import React from "react";

import Response from "../../Logic/Response";

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import './QuestionCard.css';
import ResponseCard from "../ResponseCard/ResponseCard";

// Inheriting from React.Component.
export default class QuestionCard extends React.Component {

    constructor(props) {
        super(props);

        // Getting the question from the props.
        const { question } = this.props;

        this.state = {
            // We load the question into the state.
            question: question,

            // We have a boolean for whether or not the user is creating a response.
            creatingResponse: false,
            // A state for storing the text for the response.
            responseText: '',
            // A boolean for the case that the user has failed to create a response.
            failedToCreateResponse: false
        }
    }

    // Method to update the text in the state.
    updateResponseText = event => this.setState({ responseText: event.target.value })

    // This method handles any form of voting that the user does to any of the responses, whether it
    // be an upvote or a downvote. Here we pass in the click event to the method so that we can use
    // the ID to identify which response was voted on.
    updateVote = event => {

        // First we load the current user and the question into the props.
        const { currentUser, question } = this.props;

        // Now we need to split the ID into two parts: the voting type and the ID of the response. We
        // do this by using the .split method to get the two parts of the string.
        const parsedTagId = event.target.split('-');

        // Then we load the voting type into the table variable.
        const table = parsedTagId[0];
        // And the ID into responseId.
        const responseId = parsedTagId[1];

        // Now we use a ternary operator on the upvotedByCurrentUser property to decide whether or not
        // we should increment or decrement the value in the table. Here we utilise the getResponseById
        // method to get the response.
        const option = (question.getResponseById(responseId).upvotedByCurrentUser) ? 'decrement' : 'increment';

        // Now we send two GET requests to the API. One to update the voting on the responses in the
        // response table...
        fetch('http://localhost:3000/responses/votes' , {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseId: responseId,
                field: table,
                option: option
            })
        })
        // And another to add a relation in the relevant link table for the current user and the response
        // that they voted on.
        fetch('http://localhost:3000/votes', {
            method: (option === 'increment') ? 'post' : 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: currentUser.id,
                responseId: responseId,
                table: table
            })
        })
    }

    // This methods handles the event that a user wants to add a response to the question.
    createResponse = () => {

        // First we get the qusetion and the response text from the state.
        const { question, responseText } = this.state;
        // And we also need the current user which is passed in from the props.
        const { currentUser } = this.props;

        // If the response text has nothing inside it then we want to return null, as this is an invalid
        // response.
        if (responseText === '') { return null }

        // Then we send a POST request to the responses endpoint in the API, passing in the text of 
        // the response, the current user's ID and the ID of the question in the body of the request.
        fetch('http://localhost:3000/responses', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseText: responseText,
                authorId: currentUser.id,
                questionId: question.id
            })
        })
        // Once we have a response, we convert the JSON to a Javascript object.
        .then(response => response.json())
        .then(data => {
            // If the request was successful then we want to update the state to say that we are no
            // longer creating a response and also clear any error messages that may have appeared.
            if (data.success) {
                this.setState({ creatingResponse: false, failedToCreateResponse: false });
            }
            // Otherwise we update the state so that an error message is shown.
            else {
                this.setState({ failedToCreateResponse: true });
            }
        })
        // If at any point during the GET request there was an error, then we display the alert message.
        .catch(err => this.setState({ failedToCreateResponse: true }));

        // Return to escape out the function.
        return null;

    }

    // Once the component has mounted we want to get all the responses from the responses table.
    componentDidMount() {

        // Loading the question from the state.
        const { question } = this.state;
        // Loading the current user from the props. This is needed in order to show the state of the
        // voting for this user, e.g. if they have already voted then we want to display that.
        const { currentUser } = this.props;

        // Sending a GET request to the responses endpoint in the API with the question ID as a parameter.
        fetch(`http://localhost:3000/responses/question-id=${question.id}`)
            .then(response => response.json())
            .then(data => {
                // If the request was not successful then we escape out the function to prevent any
                // errors from occuring.
                if (!data.success) {
                    return null;
                }

                // We create a temporary copy of the question in the state.
                const tempQuestion = question;
                // For each of the responses that have been fetched from the API...
                data.responses.forEach(response => {

                    // We create variables to store whether or not the user has voted on this response
                    // for both upvoting and downvoting. We do this by using the getUpvoteResponseId
                    // method to try and find the response.
                    let upvotedByCurrentUser = currentUser.getUpvoteResponseId(response.response_id);
                    let downVotedByCurrentUser = currentUser.getDownvoteResponseId(response.response_id);

                    // If there is a response, then we want to assign true to the upvotedByCurrentUser
                    // so that we can display the fact that the current user has already voted.
                    if (upvotedByCurrentUser !== false) {
                        upvotedByCurrentUser = true;
                    }
                    // The same goes for downvoting.
                    if (downVotedByCurrentUser !== false) {
                        downVotedByCurrentUser = true;
                    }

                    // Once all of this logic has been performed we can add a new instance of the Response
                    // class with the booleans that we created earlier.
                    tempQuestion.addResponse(new Response(
                        response.response_id,
                        response.response_text,
                        response.author_id,
                        response.question_id,
                        response.is_solution,
                        response.upvotes,
                        response.downvotes,
                        upvotedByCurrentUser,
                        downVotedByCurrentUser
                    ));
                });

                // Finally we update the state with the new question that we have created.
                this.setState({ question: tempQuestion });
            })
    }

    // The render method for Question Card.
    render() {

        // Here we get the question, the creatingResponse boolean and the failedToCreateResponse boolean
        // from the state.
        const { question, creatingResponse, failedToCreateResponse } = this.state;
        // Then we get the user from the props.
        const { currentUser } = this.props;

        // Now we utilise the getOrderedResponses method on the question to get all of the responses
        // in the order we require, i.e. solutions should be at the top and the other responses should
        // be ordered based off of the formula created earlier.
        const orderedResponses = question.getOrderedResponses();

        return (
            <div style={{ margin: '10px' }}>
                <Card border={'primary'}>
                <Card.Body>
                    <Card.Title>{question.title}</Card.Title>
                    <Card.Subtitle>{question.uploadDate.split('T')[0]}</Card.Subtitle>
                    <Card.Text>{question.text}</Card.Text>
                    
                    <span className={'material-symbols-outlined'} id={'reply-icon'} onClick={() => this.setState({ creatingResponse: true })}>reply</span>

                    <ListGroup>
                    {
                        creatingResponse &&
                        <ListGroup.Item>
                            <Form.Control as={'textarea'} rows={3} onChange={this.updateResponseText} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <span className={'material-symbols-outlined'} onClick={this.createResponse}>done</span>
                                <span className={'material-symbols-outlined'} onClick={() => this.setState({ creatingResponse: false })}>close</span>
                            </div>
                        </ListGroup.Item>
                    }
                    {
                        failedToCreateResponse &&
                        <Alert variant={'danger'}>Failed To Create Response</Alert>
                    }

                    {
                        orderedResponses.map((response, i) => {
                            return (
                                <ResponseCard response={response} currentUser={currentUser} key={i} question={question} />
                            );
                        })
                    }
                    </ListGroup>
                </Card.Body>
                </Card>
            </div>
        );
    }
}