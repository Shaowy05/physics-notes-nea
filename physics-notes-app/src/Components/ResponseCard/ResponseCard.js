import React from "react";

import ListGroup from 'react-bootstrap/ListGroup';

// Inheriting from React.Component.
export default class ResponseCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Storing the response instance into the state.
            response: props.response,
            // Also getting the current user. This is needed to find out whether or not the user has
            // voted on this response already.
            currentUser: props.currentUser,

            // If there was a failure then we need to render an alert.
            failedToUpdateVote: false
        }

    }

    // Method for updating the votes in the backend. Here we take in the table, either upvotes or downvotes,
    // as a paramter in order to know which table to update.
    updateVote = table => {

        // First we destructure the state to get the response and the current user.
        const { response, currentUser } = this.state;

        // Declare an action variable. This will store either 'decrement' or 'increment'.
        let action;

        // If the table we want to update is 'upvotes' then we user the upvotedByCurrentUser property
        // to find out whether or not we should increment or decrement. If the user has already voted
        // on this response then we want to decrement and vice versa.
        if (table === 'upvotes') {
            action = (response.upvotedByCurrentUser) ? 'decrement' : 'increment';
        }
        // Otherwise do the same but with the downvotes table.
        else if (table === 'downvotes') {
            action = (response.downVotedByCurrentUser) ? 'decrement' : 'increment';
        }
        // If the table was neither than an error has occured and we should alert the user to tell them
        // that something has gone wrong.
        else {
            this.setState({ failedToUpdateVote: true });
            return null;
        }

        // The first thing we have to do is update the number of upvotes/downvotes on the response in
        // the responses table. To do this, we send a PUT request to the responses/vote endpoint in
        // API, passing it the response ID, the field and the action that we want to perform.
        const updateVotesInResponses = fetch('http://localhost:3000/responses/vote', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                responseId: response.id,
                field: table,
                action: action 
            })
        })
        // Once this has done we turn the JSON response into a Javascript object.
        .then(response => response.json())
        .then(data => {
            // If the API call was not successful then we log the message to the console.
            if (!data.success) {
                console.log(data.message);
            }
        })
        // If there was an error at any point then we show the alert to the user to tell them that there
        // was a failure while trying to update the table.
        .catch(err => {
            console.log(err);
            this.setState({ failedToUpdateVote: true });
        })

        // The second thing we need to do is update the upvotes/downvotes link table to either add or
        // remove the user from it.
        const updateVotes = fetch('http://localhost:3000/votes', {
            // Here the method is different depending on the 'action' variable that we created earlier.
            // If the user wants to increment the number of votes then we want to add the user to the
            // link table, hence we use a POST request. Otherwise, we want to send a DELETE request.
            method: (action === 'increment') ? 'post' : 'delete',
            // Specifying that we are sending JSON.
            headers: {'Content-Type': 'application/json'},
            // Now we pass in the current user's ID, the response ID and the table that we want to update.
            body: JSON.stringify({
                userId: currentUser.id,
                responseId: response.id,
                table: table
            })
        })
        // If there was an error then we again show the alert to the user to tell them that something
        // went wrong.
        .catch(err => {
            console.log(err);
            this.setState({ failedToUpdateVote: true });
        })

        // Once both of these actions have been completed...
        Promise.all([updateVotesInResponses, updateVotes])
            .then(data => {
                // We want to update the state so that the user has visual feedback on their vote.
                this.setState(state => {
                    // First we create a temporary variable to store the response that they have voted
                    // on.
                    const tempResponse = state.response;
                    // Depending on the table that we have just updated, we want to use the toggleUpvoted
                    // or toggleDownvoted methods on the response, so that the buttons indicating the
                    // upvotes and downvotes can change colour.
                    if (table === 'upvotes') {
                        tempResponse.toggleUpvoted();
                    }
                    else {
                        tempResponse.toggleDownvoted();
                    }
                    // Now we update the state.
                    return { response: tempResponse, failedToUpdateVote: false };
                // Once this has been performed we can use a callback function on the setState method
                // to update the count on the voting.
                }, () => {
                    // First we declare a variable for the new number of votes.
                    let newCount;

                    // Now we get the element in the document using its ID. Here we use string interpolation
                    // to find the element with the relevant table and the current response ID as its
                    // ID.
                    const element = document.getElementById(`${table}-${response.id}`);
                    // Now we get the current count by converting the innerHTML property of the element
                    // to an integer.
                    newCount = parseInt(element.innerHTML);

                    // If the action we want to perform is increment then we add one to the count.
                    if (action === 'increment') {
                        newCount += 1;
                    // Otherwise we want to decrease it by one.
                    } else {
                        newCount -= 1;
                    }

                    // Then we set the innerHTMl of the element to the new number that we have created.
                    element.innerHTML = newCount;
                })
            })
            // If there was an error at any point then we want to send an alert, telling the user that
            // something went wrong.
            .catch(err => this.setState({ failedToUpdateVote: true }));
    }

    // If the user marks a response as a solution, then we need to update the table in the backend and
    // also we need to update the visual of the button so that the user knows it is a response.
    markResponseAsSolution = () => {

        // Getting the current user from the state and the question from the props.
        const { currentUser } = this.state;
        const { question } = this.props;

        // If the current user is not the author of the question then we return null, since only the
        // author of the question can mark a response as a solution.
        if (currentUser.id !== question.authorId) {
            return null;
        }

        // Then we change the state to represent the change.
        this.setState(state => {
            // Creating a temporary variable for the response.
            const tempResponse = state.response;
            // Here we use the toggle is solution method to change the isSolution property on the response.
            tempResponse.toggleIsSolution();
            // Finally we update the state with the new response.
            return({ response: tempResponse });
        }, () => {
            // Now we need to update this in the backend. Here we load the response from the state.
            const { response } = this.state;

            // Send a PUT request to the responses/is-solution endpoint to update the database.
            fetch('http://localhost:3000/responses/is-solution', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                // In the body we pass in the ID of the response the new isSolution property.
                body: JSON.stringify({
                    responseId: response.id,
                    isSolution: response.isSolution
                })
            })
            // If there was an error then we log it to the console.
            .catch(err => console.log(err));
        })
    }

    // Render function for the response component.
    render() {

        // Getting the response and the current user from the state.
        const { response, currentUser } = this.state;
        // Getting the question from the props.
        const { question } = this.props;

        return (
            <ListGroup.Item color={response.getSolutionColour()}>
                <p dangerouslySetInnerHTML={{__html: response.text}} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {
                        (question.authorId === currentUser.id || response.isSolution === true) &&
                        <span
                            className={'material-symbols-outlined'}
                            style={{ color: response.getSolutionColour() }}
                            onClick={() => this.markResponseAsSolution()}
                        >check</span>
                    }
                    <div id={`upvotes-${response.id}`}>{response.upvotes}</div>
                    <span
                        className={'material-symbols-outlined'}
                        style={{ color: response.getUpvoteColour() }}
                        onClick={() => this.updateVote('upvotes')}
                    >add</span>
                    <div id={`downvotes-${response.id}`}>{response.downvotes}</div>
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