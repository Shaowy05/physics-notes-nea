import binarySearch from "./Algorithms/BinarySearch";

export default class User {

    constructor(id, fn, ln, canPost, intake, isPrivate, numOfPosts, upvoteResponseIds=[], downvoteResponseIds=[]) {

        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.canPost = canPost;
        this.intake = intake;
        this.isPrivate = isPrivate;
        this.numOfPosts = numOfPosts;
        this.upvoteResponseIds = upvoteResponseIds;
        this.downvoteResponseIds = downvoteResponseIds;

    }

    updateNumOfPosts = nOP => this.numOfPosts = nOP;

    updateIsPrivate = iP => {
        if (this.isPrivate !== iP) {
            this.isPrivate = iP;
        }

        return this.isPrivate;
    }

    updateUpvoteResponseIds = id => this.upvoteResponseIds.push(id);
    updateDownvoteResponseIds = id => this.downvoteResponseIds.push(id);

    getUpvoteResponseId = responseId => binarySearch(this.upvoteResponseIds, responseId); 
    getDownvoteResponseId = responseId => binarySearch(this.downvoteResponseIds, responseId); 

    getFullName = () => `${this.firstName} ${this.lastName}`;

}