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

    getUpvoteColour = () => this.upvotedByCurrentUser ? 'green' : 'grey';
    getDownvoteColour = () => this.downVotedByCurrentUser ? 'red' : 'grey';

    toggleUpvoted = () => this.upvotedByCurrentUser = !this.upvotedByCurrentUser;
    toggleDownvoted = () => this.downVotedByCurrentUser = !this.downVotedByCurrentUser;

}