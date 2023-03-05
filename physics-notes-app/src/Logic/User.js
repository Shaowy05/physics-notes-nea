import binarySearch from "./Algorithms/BinarySearch";

export default class User {

    constructor(id, fn, ln, canPost, intake, isPrivate, upvoteResponseIds=[], downvoteResponseIds=[]) {

        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.canPost = canPost;
        this.intake = intake;
        this.isPrivate = isPrivate;
        this.upvoteResponseIds = upvoteResponseIds;
        this.downvoteResponseIds = downvoteResponseIds;

    }

    updateUpvoteResponseIds = id => this.upvoteResponseIds.push(id);
    updateDownvoteResponseIds = id => this.downvoteResponseIds.push(id);

    getUpvoteResponseId = responseId => binarySearch(this.upvoteResponseIds, responseId); 
    getDownvoteResponseId = responseId => binarySearch(this.downvoteResponseIds, responseId); 

    getFullName = () => `${this.firstName} ${this.lastName}`;

}