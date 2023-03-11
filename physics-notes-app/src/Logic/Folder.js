// Exporting the Folder class
export default class Folder {

    // PROPERTIES ==================================================================================
    constructor(id, number, title, hasNotes, parentId, type, tags = []) {
        this.id = id;
        this.number = number;
        this.title = title;
        this.hasNotes = hasNotes;
        this.parentId = parentId;
        this.type = type;
        this.tags = tags
    }
    // =============================================================================================

    addTag = tag => {
        this.tags.push(tag);
    }

}