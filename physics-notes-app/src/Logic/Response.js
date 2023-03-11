// Exporting the Response class
export default class Response {

    // PROPERTIES ==================================================================================
    constructor(responseId, responseText, authorId, questionId, isSolution, upvotes, downvotes, upvotedByCurrentUser, downVotedByCurrentUser) {
        this.id = responseId;
        this.text = responseText;
        this.authorId = authorId;
        this.questionId = questionId;
        this.isSolution = isSolution;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        // These are booleans indicating whether or not the current user that is logged in has voted
        // on this particular resposne
        this.upvotedByCurrentUser = upvotedByCurrentUser;
        this.downVotedByCurrentUser = downVotedByCurrentUser;
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // A method to return the colour green if the user has upvoted, or grey if they have not.
    getUpvoteColour = () => this.upvotedByCurrentUser ? 'lawngreen' : 'grey';
    // Returns red if they have downvoted, or grey if they have not.
    getDownvoteColour = () => this.downVotedByCurrentUser ? 'crimson' : 'grey';

    // If this response has been marked as a solution, then it returnst the colour green, otherwise
    // return grey.
    getSolutionColour = () => this.isSolution ? 'lawngreen' : 'grey';

    // These two methods act as toggles for the upvoted/downvotes state. This is done by simply setting
    // the property to the opposite of itself using the NOT logical operator.
    toggleUpvoted = () => this.upvotedByCurrentUser = !this.upvotedByCurrentUser;
    toggleDownvoted = () => this.downVotedByCurrentUser = !this.downVotedByCurrentUser;

    // The same is done with the isSolution property.
    toggleIsSolution = () => this.isSolution = !this.isSolution;

    // Here is the method for getting the 'score' of a response based off of the number of upvotes and
    // downvotes that it has. The formula is not great, usually you would use something known as the
    // wilson score. This would provide a proportionally accurate way of representing the score for
    // response, but due to its complexity I have decided to opt for a simpler method.
    getVotingScore = () => {

        // Because we divide by the total votes in the formula, we first have to makes sure that the
        // total does not equal 0. If it does then we return 0 as the score and escape out the method.
        if (this.upvotes + this.downvotes === 0) {
            return 0;
        }
        // The score is given by the the number of upvotes - the number of downvotes. Then we divide
        // this number by the total number of upvotes and downvotes, and return it.
        return (this.upvotes - this.downvotes) / (this.upvotes + this.downvotes);
    }
    // =============================================================================================
}