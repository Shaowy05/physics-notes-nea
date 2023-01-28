// The folder class stores information about sections, topics etc

export default class Folder {

    // Constructor
    constructor(id, number, title, hasNotes, parentId, type) {
        this.id = id;
        this.number = number;
        this.title = title;
        this.hasNotes = hasNotes;
        this.parentId = parentId;
        this.type = type;
    }

}