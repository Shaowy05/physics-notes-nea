import React from "react";

import Response from "../../Logic/Response";

import Card from 'react-bootstrap/Card';

import './QuestionCard.css';

export default class QuestionCard extends React.Component {

    constructor(props) {
        super(props);

        const { question } = this.props;

        this.state = {
            question: question 
        }
    }

    createResponse = () => {

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
        console.log(question);

        return (
            <div style={{ margin: '10px' }}>
                <Card bg={'secondary'}>
                <Card.Body>
                    <Card.Subtitle>{question.title}</Card.Subtitle>
                    <Card.Text>{question.text}</Card.Text>
                    
                    <span class="material-symbols-outlined" id={'reply-icon'} onClick={this.createResponse}>reply</span>

                    {
                        question.hasResponses() &&
                        <Card.Footer>
                        {
                        question.responses.map((response, i) => {
                            return (
                                <div key={i}>
                                <Card.Subtitle>{response.title}</Card.Subtitle>
                                <Card.Text>{response.text}</Card.Text>
                                </div>
                            );
                        })
                        }
                        </Card.Footer>
                    }
                </Card.Body>
                </Card>
            </div>
        );

    }

}