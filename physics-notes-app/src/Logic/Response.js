export default class Response {

    constructor(responseId, responseText, authorId, questionId, isSolution, upvotes, downvotes, upvotedByCurrentUser, downVotedByCurrentUser) {
        this.id = responseId;
        this.text = responseText;
        this.authorId = authorId;
        this.questionId = questionId;
        this.isSolution = isSolution;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.upvotedByCurrentUser = upvotedByCurrentUser;
        this.downVotedByCurrentUser = downVotedByCurrentUser;
    }

    getUpvoteColour = () => this.upvotedByCurrentUser ? 'lawngreen' : 'grey';
    getDownvoteColour = () => this.downVotedByCurrentUser ? 'crimson' : 'grey';

    getSolutionColour = () => this.isSolution ? 'lawngreen' : 'grey';

    toggleUpvoted = () => this.upvotedByCurrentUser = !this.upvotedByCurrentUser;
    toggleDownvoted = () => this.downVotedByCurrentUser = !this.downVotedByCurrentUser;

    toggleIsSolution = () => this.isSolution = !this.isSolution;

    getVotingScore = () => {

        if (this.upvotes + this.downvotes === 0) {
            return 0;
        }

        return (this.upvotes - this.downvotes) / (this.upvotes + this.downvotes);
    }

}