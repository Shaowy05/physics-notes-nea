import React from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import Question from "../../Logic/Question";
import QuestionCard from "../QuestionCard/QuestionCard";

import './ForumCard.css';

// Inheriting from React.Component.
export default class ForumCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // Here we have a state storing the array of questions.
            questionArray: null,
            // A boolean for checking whether or not the questions have been fetched or not. This is
            // used to render a loading screen if the questions haven't been loaded yet.
            questionsFetched: false,

            // If the user is adding a question we need to render the page differently so we store a
            // boolean to represent this as well.
            addingQuestion: false,
            // The input field for the question title.
            questionTitle: '',
            // The input field for the text.
            questionText: '',
            // If there was a failure during adding the question then we want to alert the user.
            failedToAddQuestion: false
        }
    }

    // Update methods for the question title and text states.
    updateQuestionTitle = event => this.setState({ questionTitle: event.target.value });
    updateQuestionText = event => this.setState({ questionText: event.target.value });

    // The mthod for posting the question, run upon the user pressing the submit button.
    postQuestion = () => {

        // Getting the current user and the parent note from the props.
        const { currentUser, parentNote } = this.props;
        // Getting the title and the text from the state.
        const { questionTitle, questionText } = this.state;

        // Now we send a POST request to the questions endpoint in the API. Passing in the title, the
        // text, the ID of the current user and the ID of the note that they have posted to.
        fetch('http://localhost:3000/questions', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                questionTitle: questionTitle,
                questionText: questionText,
                authorId: currentUser.id,
                noteId: parentNote.id
            })
        })
        // Converting the response from JSON to a Javascript object.
        .then(response => response.json())
        // With this response...
        .then(data => {
            // If the request was successful, then we set the adding question state to be false and
            // we set the failed to add question state to be false so that any errors that may have
            // occurred recently are wiped.
            if (data.success) {
                this.setState({ addingQuestion: false, failedToAddQuestion: false });
            // Otherwise we update the failed to add question state to be true so that the user has
            // visual feedback.
            } else {
                this.setState({ failedToAddQuestion: true });
            }
        })
        // If there was an error at any point we log it to the console.
        .catch(err => console.log(err));

        // Finally we return null to escape out of the function.
        return null;

    }

    // Once the component has mounted, we want to get all the questions ready for if the User wants
    // view the forum. This provides the quickest way to provide the user with visual feedback.
    componentDidMount() {

        // Getting the parent note from the props.
        const { parentNote } = this.props;

        // Using the ID of the note, we can send a GET request to the questions endpoint, passing in
        // the ID as a paramter so that we can get all the questions relevant to the set of notes that
        // they are viewing.
        fetch(`http://localhost:3000/questions/note-id=${parentNote.id}`)
            // Converting the JSON to Javascript.
            .then(response => response.json())
            .then(data => {
                // If the request was not successful we return null to escape out of the function. This
                // leaves the user with the loading screen to show that something has gone wrong.
                if (!data.success) {
                    return null;
                }

                // Otherwise, we can use the questions retrieved from the database so that we can create
                // the question array to put in the state. We do this by using the .map method on the
                // questions passed in.
                const questionArray = data.questions.map(question => {
                    // For each question we return a new instance of the Question class.
                    return new Question(
                        question.question_id,
                        question.question_title,
                        question.question_text,
                        question.author_id,
                        question.note_id,
                        question.upload_date
                    );
                })
                // Once the question array has been created we can add it to the state, and we set the
                // questionsFetched state to be true so that the user doesn't see the loading screen
                // anymore.
                this.setState({ questionArray: questionArray, questionsFetched: true });

            })
            // If there was an error at any point we log to the console.
            .catch(err => console.log(err));
    }

    // The render method for the Forum Card component.
    render() {

        // Getting the relevant info from the state.
        const { questionArray, questionsFetched, addingQuestion, failedToAddQuestion } = this.state;
        // Getting the current user from the props so that we can pass it into the responses.
        const { currentUser } = this.props;

        // If the questions have been fetched then we can safely return the questions to the user.
        if (questionsFetched) {
            return (
                <div>
                    {
                        questionArray.map((question, i) => {
                            return(<QuestionCard question={question} key={i} currentUser={currentUser} />);
                        })
                    }
                    {
                        !addingQuestion ?
                        <Button onClick={() => this.setState({ addingQuestion: true })}>Add Question</Button>
                        :
                        <Card>
                            <Card.Header>Add Question</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Label>Question Title</Form.Label>
                                    <Form.Control onChange={this.updateQuestionTitle} />
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control  as={'textarea'} rows={4} onChange={this.updateQuestionText} />
                                </Form>
                            </Card.Body>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '5px' }}>
                                <Button size={'sm'} variant={'success'} onClick={this.postQuestion}>Submit</Button>
                                <Button size={'sm'} variant={'danger'} onClick={() => this.setState({ addingQuestion: false, failedToAddQuestion: false })}>Cancel</Button>
                            </div>
                            {
                                failedToAddQuestion &&
                                <Alert variant={'danger'}>Failed to add</Alert>
                            }
                        </Card>
                    }
                </div>
            );
        }
        // Otherwise, the questions haven't been properly fetched yet so we render a loading screen.
        else {
            return (
                <div className={'centralise'}>
                    <h5>Getting Questions...</h5>
                    <div className={'loader'}></div>
                </div>
            );
        }
    }
}