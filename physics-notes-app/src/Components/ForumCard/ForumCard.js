import React from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import Question from "../../Logic/Question";
import QuestionCard from "../QuestionCard/QuestionCard";

import './ForumCard.css';

export default class ForumCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            questionArray: null,
            questionsFetched: false,

            addingQuestion: false,
            questionTitle: '',
            questionText: '',
            failedToAddQuestion: false
        }
    }

    updateQuestionTitle = event => this.setState({ questionTitle: event.target.value });

    updateQuestionText = event => this.setState({ questionText: event.target.value });

    postQuestion = () => {

        const { currentUser, parentNote } = this.props;
        const { questionTitle, questionText } = this.state;

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
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({ addingQuestion: false, failedToAddQuestion: false });
            } else {
                this.setState({ failedToAddQuestion: true });
            }
        })
        .catch(err => console.log(err));

        return null;

    }

    componentDidMount() {

        const { parentNote } = this.props;

        fetch(`http://localhost:3000/questions/note-id=${parentNote.id}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    return null;
                }

                const questionArray = data.questions.map(question => {
                    return new Question(
                        question.question_id,
                        question.question_title,
                        question.question_text,
                        question.author_id,
                        question.note_id,
                        question.upload_date
                    );
                })

                this.setState({ questionArray: questionArray, questionsFetched: true });

            })
            .catch(err => console.log(err));

    }

    render() {

        const { questionArray, questionsFetched, addingQuestion, failedToAddQuestion } = this.state;
        const { currentUser } = this.props;

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