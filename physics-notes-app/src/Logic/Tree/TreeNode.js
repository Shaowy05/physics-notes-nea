// TreeNode is a class which is used to represent nodes in a generic tree
// This is used in the TopicTable component to store the topics

export default class TreeNode {

    // Constructor for TreeNode
    constructor(key, data) {
        // A unique identifier for each node, that allows for comparisons
        this.key = key;
        this.data = data;
        this.children = [];
    }

    // Getters
    getKey = () => this.key;
    getData = () => this.data;
    getChildren = () => this.children;

    // Method to add node to children
    addChild = (child) => this.children.push(child);

}