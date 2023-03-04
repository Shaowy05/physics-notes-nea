import React from "react";

import Response from "../../Logic/Response";

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import './QuestionCard.css';
import ResponseCard from "../ResponseCard/ResponseCard";

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

    updateVote = event => {

        const { currentUser, question } = this.props;

        const parsedTagId = event.target.split('-');

        const table = parsedTagId[0];
        const responseId = parsedTagId[1];

        const option = (question.getResponseById(responseId).upvotedByCurrentUser) ? 'decrement' : 'increment';

        fetch('http://localhost:3000/responses/votes' , {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseId: responseId,
                field: table,
                option: option
            })
        })

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

                    let upvotedByCurrentUser = currentUser.getUpvoteResponseId(response.response_id);
                    let downVotedByCurrentUser = currentUser.getDownvoteResponseId(response.response_id);

                    if (upvotedByCurrentUser !== false) {
                        upvotedByCurrentUser = true;
                    }

                    if (downVotedByCurrentUser !== false) {
                        downVotedByCurrentUser = true;
                    }

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
        const { currentUser } = this.props;

        const orderedResponses = question.getOrderedResponses();

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