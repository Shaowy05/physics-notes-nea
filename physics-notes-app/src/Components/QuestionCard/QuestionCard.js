import React from "react";

import Response from "../../Logic/Response";

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import './QuestionCard.css';

export default class QuestionCard extends React.Component {

    constructor(props) {
        super(props);

        const { question } = this.props;

        this.state = {
            question: question,

            creatingResponse: false,
            responseText: '',
            failedToCreateResponse: false
        }
    }

    updateResponseText = event => this.setState({ responseText: event.target.value })

    updateUpvote = event => {

        const { currentUser, question } = this.props;

        const responseId = (event.target.id).split('-')[1];

        const option = (question.getResponseById(responseId).upvotedByCurrentUser) ? 'decrement' : 'increment';

        fetch('http://localhost:3000/responses/vote' , {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseId: responseId,
                field: 'upvotes',
                option: option
            })
        })

        // ADD FEATURE TO UPDATE USER TO RESPONSE TABLE
    }

    createResponse = () => {

        const { question, responseText } = this.state;
        const { currentUser } = this.props;

        if (responseText === '') { return null }

        fetch('http://localhost:3000/responses', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseText: responseText,
                authorId: currentUser.id,
                questionId: question.id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({ creatingResponse: false, failedToCreateResponse: false });
            }
            else {
                this.setState({ failedToCreateResponse: true });
            }
        })
        .catch(err => this.setState({ failedToCreateResponse: true }));

        return null;

    }

    componentDidMount() {

        const { question } = this.state;
        const { currentUser } = this.props;

        fetch(`http://localhost:3000/responses/question-id=${question.id}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    return null;
                }

                const tempQuestion = question;
                data.responses.forEach(response => {

                    const upvotedByCurrentUser = currentUser.getUpvoteResponseId(response.response_id);
                    const downVotedByCurrentUser = currentUser.getDownvoteResponseId(response.response_id);

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

                this.setState({ question: tempQuestion });

            })

    }

    render() {

        const { question, creatingResponse, failedToCreateResponse } = this.state;

        return (
            <div style={{ margin: '10px' }}>
                <Card border={'primary'}>
                <Card.Body>
                    <Card.Subtitle>{question.title}</Card.Subtitle>
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
                        question.responses.map((response, i) => {
                            return (
                                <div key={i}>
                                <ListGroup.Item>
                                    {response.text}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <span className={'material-symbols-outlined'}>check</span>
                                        {response.upvotes}
                                        <span
                                            className={'material-symbols-outlined'}
                                            id={`upvote-${response.id}`}
                                            style={{ color: response.getUpvoteColour() }}
                                        >add</span>
                                        {response.downvotes}
                                        <span
                                            className={'material-symbols-outlined'}
                                            id={`downvote-${response.id}`}
                                            style={{ color: response.getDownvoteColour() }}
                                        >remove</span>
                                    </div>
                                </ListGroup.Item>
                                </div>
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