import React from "react";

import Question from "../../Logic/Question";
import QuestionCard from "../QuestionCard/QuestionCard";

import './ForumCard.css';

export default class ForumCard extends React.Component {

    constructor() {
        super();
        this.state = {
            questionArray: null,
            questionsFetched: false
        }
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

                this.setState({ questionArray: questionArray, questionsFetched: true })

            })
            .catch(err => console.log(err));

    }

    render() {

        const { questionArray, questionsFetched } = this.state;

        if (questionsFetched) {
            return (
                <div>
                    {
                        questionArray.map(question => {
                            <QuestionCard question={question} />
                        })
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