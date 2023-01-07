// Importing Stack for Depth First Traversal
import Stack from "../Stack";
import CircularQueue from "../CircularQueue";

class Path {

    constructor() {
        this.pathString = '';
    }

    addToPath(data) {

        const { id, number, title } = data;
        this.pathString = this.pathString.concat(`/${title}`)

    }

    getPathString() {
        return this.pathString;
    }

}

// Class for Tree
export default class Tree {

    // Constructor for Tree
    constructor(rootNode, maxNodeCount) {
        this.rootNode = rootNode;
        this.maxNodeCount = maxNodeCount;
    }

    // Various Tree Traversal Methods
    depthFirstSearch = node => {
        
    }

    breadthFirstSearch = (node, maxNodeCount) => {

        // Creating a Queue
        const queue = new CircularQueue(maxNodeCount);

        // Adding the Root Node to the Queue
        queue.enQueue(this.rootNode);

        // Loop while the queue is not empty
        while (!queue.isEmpty) {

            

        }

    }

}