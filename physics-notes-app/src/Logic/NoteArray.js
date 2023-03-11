// Here we import the merge sort algorithm for sorting the notes by ID
import mergeSort from "./Algorithms/MergeSort";
// Then we import binary search. This is needed to find out whether or not the Note Array contains a
// particular set of notes.
import binarySearch from "./Algorithms/BinarySearch";

// Exporting the Note Array class to be used in other areas of the program.
export default class NoteArray {

    // PROPERTIES ==================================================================================
    constructor() {
        this.notes = [];
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // A simple get for the notes array
    getNotes = () => this.notes;
    // Adding a note to the notes array
    addNote = note => this.notes.push(note);

    // The sort notes algorithms is not used by the frontend currently. It's required for the getNoteById
    // method implemented below. This method sorts the notes by ID.
    sortNotes = notes => {

        // Declaring an array to store the final product.
        let orderedNotes = [];
        // An array for storing all the IDs so that they can be sorted.
        let idArray = [];

        // Much like the folder array class, we need a way to backtrack the ID to the Note that it came
        // from. For this we use a Javascript object to act as a dictionary with O(1) lookup times.
        const idToNote = {};

        // For each note in the notes array...
        notes.forEach(note => {
            // We want to add a key-value pair to the dictionary.
            idToNote[note.id] = note;
            // And add the ID to the ID array.
            idArray.push(note.id);
        });

        // Now we sort the IDs in the ID array.
        idArray = mergeSort(idArray);

        // And sequentially add all the notes into the ordered notes array.
        idArray.forEach(id => orderedNotes.push(idToNote[id]));

        // Finally we return the product
        return orderedNotes;

    }

    // This is a method for determining whether or not a particular set of notes is in this instance
    // of the note array class, but it also returns the notes as well. The method takes in one paramater
    // the ID of the notes the user is looking for.
    getNoteById = noteId => {

        // Storing the notes into a constant for easier use.
        const notes = this.notes;
        // Apply the sortNotes method to the notes to make sure that they are sorted.
        const orderedNotes = this.sortNotes(notes);

        // An array for the IDs of the notes.
        const idArray = [];

        // For each of the notes we want to add it's ID to the array.
        orderedNotes.forEach(note => idArray.push(note.id));

        // Now we run the binary search function on the array of IDs, looking for the ID passed in as
        // the paramter.
        const noteIndex = binarySearch(idArray, noteId);

        // If the index is not false, then we found the notes and we can return the instance as a result
        // otherwise, we return false indicating that the notes the user was looking for was not in
        // the array.
        return (noteIndex !== false) ? orderedNotes[noteIndex] : false; 

    }
    // =============================================================================================

}