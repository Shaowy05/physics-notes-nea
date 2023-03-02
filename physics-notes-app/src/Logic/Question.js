import binarySearch from "./Algorithms/BinarySearch";
import mergeSort from "./Algorithms/MergeSort";

export default class Question {

    constructor(questionId, questionTitle, questionText, authorId, noteId, uploadDate, responses = []) {
        this.id = questionId;
        this.title = questionTitle;
        this.text = questionText;
        this.authorId = authorId;
        this.noteId = noteId;
        this.uploadDate = uploadDate;
        this.responses = responses;
    }

    addResponse = response => this.responses.push(response);

    hasResponses = () => this.responses.length === 0 ? false : true;

    sortResponses = responses => {

        let orderedResponses = [];
        let idArray = [];

        const idToResponse = {};

        responses.forEach(response => {
            idToResponse[response.id] = response;
            idArray.push(response.id);
        });

        idArray = mergeSort(idArray);

        idArray.forEach(id => orderedResponses.push(idToResponse[id]));

        return orderedResponses;

    }

    getResponseById = responseId => {

        const responses = this.responses;
        const orderedResponses = this.sortResponses(responses);

        const idArray = [];

        orderedResponses.forEach(response => idArray.push(response.id));

        const responseIndex = binarySearch(idArray, responseId);

        return (responseIndex !== false) ? orderedResponses[responseIndex] : false;

    }

}