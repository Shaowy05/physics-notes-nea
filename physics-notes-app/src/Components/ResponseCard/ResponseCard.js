import React from "react";

import ListGroup from 'react-bootstrap/ListGroup';

export default class ResponseCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            response: props.response,
            currentUser: props.currentUser,

            failedToUpdateVote: false
        }

    }

    updateVote = table => {

        const { response, currentUser } = this.state;

        let action;

        if (table === 'upvotes') {
            action = (response.upvotedByCurrentUser) ? 'decrement' : 'increment';
        }
        else if (table === 'downvotes') {
            action = (response.downVotedByCurrentUser) ? 'decrement' : 'increment';
        }
        else {
            this.setState({ failedToUpdateVote: true });
            return null;
        }
        console.log(action)

        const updateVotesInResponses = fetch('http://localhost:3000/responses/vote', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseId: response.id,
                field: table,
                action: action 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.log(data.message);
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({ failedToUpdateVote: true });
        })

        const updateVotes = fetch('http://localhost:3000/votes', {
            method: (action === 'increment') ? 'post' : 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: currentUser.id,
                responseId: response.id,
                table: table
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({ failedToUpdateVote: true });
        })

        Promise.all([updateVotesInResponses, updateVotes])
            .then(data => {
                this.setState(state => {
                    const tempResponse = state.response;
                    if (table === 'upvotes') {
                        tempResponse.toggleUpvoted();
                    }
                    else {
                        tempResponse.toggleDownvoted();
                    }
                    return { response: tempResponse };
                })
            })
    }

    render() {

        const { response } = this.state;

        return (
            <ListGroup.Item>
                {response.text}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span className={'material-symbols-outlined'}>check</span>
                    {response.upvotes}
                    <span
                        className={'material-symbols-outlined'}
                        style={{ color: response.getUpvoteColour() }}
                        onClick={() => this.updateVote('upvotes')}
                    >add</span>
                    {response.downvotes}
                    <span
                        className={'material-symbols-outlined'}
                        style={{ color: response.getDownvoteColour() }}
                        onClick={() => this.updateVote('downvotes')}
                    >remove</span>
                </div>
            </ListGroup.Item>
        );
    }

}