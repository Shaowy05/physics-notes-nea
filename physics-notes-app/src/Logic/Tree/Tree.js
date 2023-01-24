// Importing Stack for Depth First Traversal
import Stack from "../Stack";
import CircularQueue from "../CircularQueue";

// Class for Tree
export default class Tree {

    // Constructor for Tree
    constructor(rootNode, maxNodeCount) {
        this.rootNode = rootNode;
        // Maximum number of nodes in the tree. Needed for queue.
        this.maxNodeCount = maxNodeCount;
    }

    // Getter for the root node
    getRootNode = () => this.rootNode;

    // Various Tree Traversal Methods
    depthFirstSearch = node => {
        
    }

    // A Breadth First Traversal of the Tree. searchKey is an optional
    // parameter that can be specified if a specific node is needed.
    breadthFirstTraversal = (searchKey = null) => {

        // Creating a Queue
        const queue = new CircularQueue(this.maxNodeCount);

        const nodeArray = new Array();

        // Creating an array of nodes that haven't been visited,
        // initially all of them, stored by TreeNode key to keep
        // constant lookup times.
        //const visited = new Array(this.maxNodeCount).fill(false);

        // Adding the Root Node to the Queue and labelling as explored
        //visited[this.rootNode.key] = true;
        queue.enQueue(this.rootNode);

        // Loop while the queue is not empty
        while (!queue.isEmpty()) {
            // Dequeue the first item
            const node = queue.deQueue();
            if (searchKey === 25) {
                console.log(node.getChildren())
            }
            nodeArray.push(node);

            // If the user is searching
            if (searchKey !== null && searchKey === node.getKey()) {
                return node
            } else {
                node.getChildren().forEach(childNode => {
                    /* if (!visited[childNode.key]) {
                        visited[childNode.key] = true;
                        queue.enQueue(childNode);
                    } */
                    queue.enQueue(childNode);
                });
            }

        }

        // If the user was searching
        if (searchKey !== null) {
            return false;
        // Otherwise
        } else {
            return nodeArray;
        }

    }

}