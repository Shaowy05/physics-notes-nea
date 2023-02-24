import mergeSort from "./Algorithms/MergeSort";

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

    // Here we implement the iterative version of Binary Search
    // as it is less space intensive than the recursive version.
    binSearch = noteId => {
        const notes = this.notes;

        const orderedNotes = this.sortNotes(notes);

        let left = 0;
        let right = orderedNotes.length - 1;
        let middle = null;

        while (left <= right) {

            middle = Math.floor((left + right) / 2);

            if (orderedNotes[middle].id < noteId) {
                left = middle + 1;
            }
            else if (orderedNotes[middle].id > noteId) {
                right = middle - 1;
            }
            else {
                return orderedNotes[middle];
            }

        }

        return Error('ID not found in note array');

    }

}