// First we import the Circular Queue data structure from the CircularQueue folder. This is needed as
// part of the breadthFirstTraversal method.
import CircularQueue from "../CircularQueue";

// Here we simultaneously create and export the Tree class. This makes it available to the other React
// components for use.
export default class Tree {

    // PROPERTIES ==================================================================================
    // Here is the constructor for the tree, where we assign two properties: the root node, and the
    // maximum number of nodes that can be used in the tree. The reason we do the latter is because
    // the circular queue data structure needs a length, and so the tree needs to have a cap on the
    // number of nodes it can contain. This isn't seen as a limitation for my web application, since
    // the value is very easy to change and even if it weren't we know the number of nodes coming in
    // when we perform the GET request on the folders route.
    constructor(rootNode, maxNodeCount) {
        this.rootNode = rootNode;
        this.maxNodeCount = maxNodeCount;
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // Here is a getter for the Root Node. As discussed at the start of the classes section, there is
    // no actual need for getters, however I added one here to make the code more descriptive when getting
    // the root node in other components. 
    getRootNode = () => this.rootNode;

    // Here is the breadth-first traversal for the Tree. I explained in the design section why I chose
    // a BFT instead of a DFT, but the TL;DR is that the tree for the folders in my particular use case
    // is quite wide, therefore suiting a BFT more. The BFT method takes in an optional parameter called
    // search key. This is a numerical value that can be used if the user is trying to find a particular
    // node i.e. wants to use the BFT as a breadth-first search instead. By using this optional parameter
    // we don't have to write a seperate function for it.
    breadthFirstTraversal = (searchKey = null) => {

        // First we create a new Circular Queue using the imported data structure at the start. We pass
        // in the max node count property of this class to assign the circular queue a length.
        const queue = new CircularQueue(this.maxNodeCount);

        // Then we create an array to store nodes. This array will be the array that we add a node to
        // everytime it is visited, hence allowing us to return an array in the order that the tree
        // was traversed.
        const nodeArray = new Array();

        // Start by adding the root node to the queue. This makes the search start at the root of the
        // tree.
        queue.enQueue(this.rootNode);

        // Now we loop until there are no more items in the queue, hence indicating that the entire
        // tree has been traversed.
        while (!queue.isEmpty()) {
            // Deqeue the first item from the array, and mark it as visited by adding it to the node
            // array. Store the node in a node variable so that we can push its children to the array.
            const node = queue.deQueue();
            nodeArray.push(node);

            // Firstly, if the user is searching, and the key within the node that we just dequeued
            // is the same as the key that the user is looking for, then return the node and escape
            // out of the function.
            if (searchKey !== null && searchKey === node.getKey()) {
                return node;
            // Otherwise, use the get children method on the node to get all the nodes that are under
            // the node we have dequeued, and loop through them and add them all to the queue.
            } else {
                node.getChildren().forEach(childNode => {
                    queue.enQueue(childNode);
                });
            }
        }

        // If the user was searching then we return false, as the key they were looking for was not
        // in the tree.
        if (searchKey !== null) {
            return false;
        // Otherwise, return the node array to show the path that the breadth first traversal took.
        } else {
            return nodeArray;
        }
    }
    // =============================================================================================
}