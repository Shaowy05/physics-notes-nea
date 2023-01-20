// TreeNode is a class which is used to represent nodes in a generic tree
// This is used in the TopicTable component to store the topics

export default class TreeNode {

    // Constructor for TreeNode
    constructor(key) {
        // Unique identifier for each node
        this.key = key
        this.children = [];
    }

    // Getters
    getKey = () => this.key;
    getChildren = () => this.children;

    // Method to add node to children
    addChild = (child) => this.children.push(child);

}