// The folder class stores information about sections, topics etc

export default class Folder {

    // Constructor
    constructor(id, number, title, type, key) {
        this.id = id;
        this.number = number;
        this.title = title;
        this.type = type
        // Same as the key on the tree
        this.key = key;
    }

}