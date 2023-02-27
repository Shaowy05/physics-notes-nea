import React from "react";

import Response from "../../Logic/Response";

import Card from 'react-bootstrap/Card';

export default class QuestionCard extends React.Component {

    constructor() {

        const { question } = this.props;

        this.state = {
            question: question
        }
    }

    componentDidMount() {

        const { question } = this.state;

        fetch(`http://localhost:3000/responses/question-id=${question.id}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    return null;
                }

                const tempQuestion = question;
                data.responses.forEach(response => {
                    tempQuestion.addResponse(new Response(
                        response.response_id,
                        response.response_text,
                        response.author_id,
                        response.question_id,
                        response.is_solution
                    ));
                });

                this.setState({ question: tempQuestion });

            })

    }

    render() {

        const { question } = this.state;

        return (
            <div>
                <Card>
                    <Card.Title>{question.title}</Card.Title>
                    <Card.Text>{question.text}</Card.Text>
                </Card>
                {
                    question.responses.map(response => {
                        return (
                            <div>
                            <Card.Subtitle>{response.title}</Card.Subtitle>
                            <Card.Text>{response.text}</Card.Text>
                            </div>
                        );
                    })
                }
            </div>
        );

    }

}