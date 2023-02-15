import CircularQueue from "./CircularQueue";

// Class for an adjacency list implementation of a graph
export default class Graph {

    constructor(maxNodeCount) {
        // Here we use a map to store the vertices and edges
        this.nodes =  new Map()
        this.maxNodeCount = maxNodeCount
    } 

    // Method to add a vertex
    addNode = node => this.nodes.set(node, []);

    // Method to add edge to graph
    addEdge = (nodeOne, nodeTwo) => {
        this.nodes.get(nodeOne).push(nodeTwo);
        this.nodes.get(nodeTwo).push(nodeOne);
    }

    getAdjacentNodesTo = node => this.nodes.get(node);

    breadthFirstSearch = (startNode, searchKey = null) => {

        // Unlike in the tree class, there may be cycles within
        // the graph, as a result an array of visited nodes is
        // required to make sure we don't enter a loop.
        const visited = {};

        // Creating the queue
        const queue = new CircularQueue(this.maxNodeCount);

        // Add the start node to the queue
        visited[startNode] = true;
        queue.enQueue(startNode);

        while (!queue.isEmpty()) {

            // Remove the first item from the queue
            const node = queue.deQueue();

            // Getting the array of adjacent nodes
            const adjacentNodes = this.nodes.get(node);

            adjacentNodes.forEach(node => {
                
                if (!visited[node]) {
                    visited[node] = true;
                    queue.enQueue(node);
                }

            });

        } 

    }

}