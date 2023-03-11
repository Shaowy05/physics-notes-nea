// First we import the binary search and the merge sort.
import binarySearch from "./Algorithms/BinarySearch";
import mergeSort from "./Algorithms/MergeSort";

// Exporting the Question class.
export default class Question {

    // PROPERTIES ==================================================================================
    constructor(questionId, questionTitle, questionText, authorId, noteId, uploadDate, responses = []) {
        this.id = questionId;
        this.title = questionTitle;
        this.text = questionText;
        this.authorId = authorId;
        this.noteId = noteId;
        this.uploadDate = uploadDate;
        // Responses is an array of instances of the Response class.
        this.responses = responses;
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // Method for adding a response to the reponses property.
    addResponse = response => this.responses.push(response);

    // Here we have a method for returning whether or not the responses array is empty, we do this by
    // checking the length of the responses array and using a conditional ternary operator to return
    // a boolean.
    hasResponses = () => this.responses.length === 0 ? false : true;

    // This method sorts the responses in preparation for binary search method. It takes in a responses
    // array as an input.
    sortResponses = responses => {

        // Declaring an array to store the final result.
        let orderedResponses = [];
        // An array to store the IDs of the array.
        let idArray = [];

        // A dictionary for the IDs and the responses.
        const idToResponse = {};

        // For every response, we add a key-value pair to the dictionary and push the ID to the array.
        responses.forEach(response => {
            idToResponse[response.id] = response;
            idArray.push(response.id);
        });

        // Sorting the IDs using the merge sort function.
        idArray = mergeSort(idArray);

        // For each of the sorted IDs add the Response to the ordered response array.
        idArray.forEach(id => orderedResponses.push(idToResponse[id]));

        // Returning the ordered responses.
        return orderedResponses;

    }

    // This method utilises the binary search function to find the response with an ID that is passed
    // as a parameter.
    getResponseById = responseId => {

        // Putting the responses in a constant for easier use.
        const responses = this.responses;
        // Here we use the earlier implemented sortResponses method to sort the responses to prep for
        // the binary search.
        const orderedResponses = this.sortResponses(responses);

        // Creating an empty array to store the IDs.
        const idArray = [];
        // For each of the responses, add its ID to the ordered responses array.
        orderedResponses.forEach(response => idArray.push(response.id));
        // Use the binary search function to find the response with the ID that was given in the parameter.
        const responseIndex = binarySearch(idArray, responseId);
        // If the result of the binary search is not false then we can return the note they were looking
        // for, otherwise the notes do not exist and we return false to indicate this.
        return (responseIndex !== false) ? orderedResponses[responseIndex] : false;

    }

    // This method is used in the forum React component for displaying the responses in the correct
    // manner. During the analysis we found that forums tend to order their responses based off of a
    // voting system, and also place responses marked as solutions at the top. This method allows us
    // to do so.
    getOrderedResponses = () => {

        // Loading the responses into a constant for ease of use.
        const responses = this.responses;
        // Declaring a variable for storing the final ordered responses.
        let ordered = [];

        // The first thing we need to do is split the responses into responses that have been marked
        // as solutions and responses that haven't.
        const solutions = [];
        const notSolutions = [];

        // Seperating the responses array. We loop through each one of the responses and check the isSolution
        // property, allowing us to conditionally add the response to the array it needs to be in.
        responses.forEach(response => {
            if (response.isSolution) {
                solutions.push(response);
            }
            else {
                notSolutions.push(response);
            }
        })

        // Then we add any responses that is a solution to the top of the ordered array. This is so
        // any solutions are displayed at the top of a forum.
        ordered = ordered.concat(solutions);

        // Similarly to ordering by title or by number in the Folder Array class, there is no guarantee
        // that two responses will have a different score, in fact it is quite likely that multiple
        // responses may the same score. For that reason, this dictionary will store arrays as values
        // rather than a single response.
        const scoreToResponseObject = {}; 

        // For each response that is not a solution...
        notSolutions.forEach(response => {
            // We load the voting score of the response into a constant
            const votingScore = response.getVotingScore()
            // If the voting score has not been seen yet, then we need to create a new key in the dictionary
            // and then we add an array containing the response to the newly made key.
            if (scoreToResponseObject[votingScore] === undefined) {
                scoreToResponseObject[votingScore] = [response];
            }
            // Otherwise, if this voting score is already a key, then we push the response to the array.
            else {
                scoreToResponseObject[votingScore].push(response);
            }
        })

        // Now we use the merge sort function on the keys of the dictionary, applying the .reverse method
        // since we want the highest score at the front.
        const orderedScores = mergeSort(Object.keys(scoreToResponseObject)).reverse(); 

        // Then for each of the keys in the dictionary, we add the responses to the ordered array.
        orderedScores.forEach(score => {
            ordered = ordered.concat(scoreToResponseObject[score]);
        });
        // Finally, we return the ordered responses.
        return ordered;
    }
    // =============================================================================================
}