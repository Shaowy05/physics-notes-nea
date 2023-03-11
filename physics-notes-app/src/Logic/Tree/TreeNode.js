// Exporting the class so that the other parts of the program can use it.
export default class TreeNode {

    // PROPERTIES ==================================================================================
    // Here is the constructor for the Tree Node class. Each node must store two values: a key representing
    // the value of the node, this needs to be unique to each tree node, and a children array containing
    // the child nodes that belong to an instance of the Tree Node.
    constructor(key) {
        // Unique identifier for each node
        this.key = key
        this.children = [];
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // Getters for making the code more readable
    getKey = () => this.key;
    getChildren = () => this.children;

    // A method ot add a child to a node, this is required for constructing the tree in the first instance
    // so that it can be properly traversed
    addChild = (child) => this.children.push(child);
    // =============================================================================================

}