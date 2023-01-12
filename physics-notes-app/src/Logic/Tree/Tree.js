// Importing Stack for Depth First Traversal
import Stack from "../Stack";
import CircularQueue from "../CircularQueue";

// Class for Tree
export default class Tree {

    // Constructor for Tree
    constructor(rootNode, maxNodeCount) {
        this.rootNode = rootNode;
        this.maxNodeCount = maxNodeCount;
    }

    // Getter for the root node
    getRootNode = () => this.rootNode;

    // Various Tree Traversal Methods
    depthFirstSearch = node => {
        
    }

    breadthFirstTraversal = (searchNode = null) => {

        // Creating a Queue
        const queue = new CircularQueue(this.maxNodeCount);

        const nodeArray = [];

        // Creating an array of nodes that haven't been visited,
        // initially all of them, stored by TreeNode key
        const visited = [];

        // Adding the Root Node to the Queue and labelling as explored
        visited[this.rootNode.key] = true;
        queue.enQueue(this.rootNode);

        // An array containing the path to the node
        //let path = [];

        // Loop while the queue is not empty
        while (!queue.isEmpty()) {

            // Dequeue the first item
            let node = queue.deQueue();
            nodeArray.push(node);

            // If the user is searching
            if (searchNode === node) {
                return node
            } else {
                node.children.forEach(childNode => {
                    if (visited[childNode.key] !== null) {
                        visited[childNode.key] = true;
                        // path.push(childNode.key);
                        queue.enQueue(childNode);
                    }
                });
            }
            
        }

        // If the user was searching
        if (searchNode !== null) {
            return false
        // Otherwise
        } else {
            return nodeArray
        }

    }

}