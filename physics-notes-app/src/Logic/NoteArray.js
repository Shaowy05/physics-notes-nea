import mergeSort from "./Algorithms/MergeSort";
import binarySearch from "./Algorithms/BinarySearch";

export default class NoteArray {

    constructor() {
        this.notes = [];
    }

    getNotes = () => this.notes;

    addNote = note => this.notes.push(note);

    // In order to utilise a binary search, the notes array must
    // be sorted by ID, here we use the previously implemented
    // mergeSort to achieve this.
    sortNotes = notes => {

        let orderedNotes = [];
        let idArray = [];

        // Create an object to act as a map for the ids
        const idToNote = {};

        notes.forEach(note => {
            idToNote[note.id] = note;
            idArray.push(note.id);
        });

        idArray = mergeSort(idArray);

        idArray.forEach(id => orderedNotes.push(idToNote[id]));

        return orderedNotes;

    }

    getNoteById = noteId => {

        const notes = this.notes;
        const orderedNotes = this.sortNotes(notes);

        const idArray = [];

        orderedNotes.forEach(note => idArray.push(note.id));

        const noteIndex = binarySearch(idArray, noteId);

        return (noteIndex !== false) ? orderedNotes[noteIndex] : false; 

    }

}