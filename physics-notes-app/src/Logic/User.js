// Importing the binary search for use later.
import binarySearch from "./Algorithms/BinarySearch";

// Exporting the User class
export default class User {

    // PROPERTIES ==================================================================================
    // Here we create the properties for the User. The only thing to note is that the upvoteResponseIds
    // and the downvoteResponseIds are optional parameters. If they aren't specified, they will default
    // to empty arrays.
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
    // =============================================================================================

    // METHODS =====================================================================================
    // These two methods are for adding IDs to the response ID arrays.
    updateUpvoteResponseIds = id => this.upvoteResponseIds.push(id);
    updateDownvoteResponseIds = id => this.downvoteResponseIds.push(id);

    // These two are for getting the responses in both the arrays based off of an ID passed in as a
    // parameter.
    getUpvoteResponseId = responseId => binarySearch(this.upvoteResponseIds, responseId); 
    getDownvoteResponseId = responseId => binarySearch(this.downvoteResponseIds, responseId); 

    // This is a basic method which returns the full name of the user using string interpolation. This
    // is used in the React app to display the name of the user if they posted a set of notes.
    getFullName = () => `${this.firstName} ${this.lastName}`;
    // =============================================================================================
}