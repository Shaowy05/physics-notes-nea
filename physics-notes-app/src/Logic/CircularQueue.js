// Exporting the class so it can be used in other areas of the program
export default class CircularQueue {

    // PROPERTIES ==================================================================================
    // The Circular Queue is defined by four properties, the length of the queue (which I have called
    // maxLength due to the fact that the Tree references it as such), the front pointer and the rear
    // pointer. These two are required to perform the methods relevant to this class. The final property
    // is the items property, essentially an array of the items stored in the Circular Queue. We assign
    // the undefined value to all of the values, this is because Javascript has dynamic length arrays
    // by default, so we fill all the items out so that it can emulate a static length array. 
    constructor(maxLength) {
        this.maxLength = maxLength;
        this.items = new Array(maxLength).fill(undefined);
        this.front = -1;
        this.rear = -1;
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // Here are two methods to test for whether the items array is full or empty. These are important
    // for the functionality of the enQueue and deQueue methods, since the action performed by these
    // two methods are dictated by whether or not the array is full or not.
    // The first method, isFull returns a boolean depending on whether or not the number of items in
    // the items array is the same as the maxlength. The way to do this is to get the rear pointer,
    // incremented by one, and mod it by the max length and then compare it to the front pointer. If
    // they are the same, then return true otherwise return false.
    isFull = () => (((this.rear + 1) % this.maxLength) === this.front) ? true : false 
    // If the front pointer is -1, then the queue is empty and we can return true otherwise we return
    // false.
    isEmpty = () => (this.front === -1) ? true : false

    // This is just a simple method to get the front item of the queue, much like the top() function
    // for a stack. Here we do a check to make sure the queue isn't empty first so that no errors are
    // thrown.
    getFrontOfQueue = () => this.front === -1 ? false : this.items[this.front];

    // The first major method of the Circular Queue class is the enQueue method. This is where the user
    // can add an item to the queue. The function takes in a parameter called item, which is just what
    // the user wants to add to the queue. Note that Javascript is not statically typed and the array
    // is not restricted to a certain data structure, so any item can be added to the Queue.
    enQueue = item => {

        // Firstly, if the queue is full, then we return an error telling the user that the queue is
        // full. This is so that me, the developer, knows to increase the max node count on the tree
        // instance.
        if (this.isFull()) {
            return new Error('Attempted to enqueue to a full queue');
        // Then we check if it is empty. This needs to be done, as in an empty queue I have set the
        // front and rear pointer to be -1, which would return an error. Se we first have to set the
        // front and rear pointer to be 0;
        } else if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
            // After that is done, we can then add the item to the array at the index 0.
            this.items[0] = item;
        // Finally if neither are true, then the queue is in its 'regular' state and we can just add
        // the item onto the rear of the queue, increasing the rear pointer by one. Note we have to
        // apply the mod function to the rear pointer to ensure that the rear pointer goes back round
        // to the start.
        } else {
            this.rear = (this.rear + 1) % this.maxLength;
            this.items[this.rear] = item;
        }

    }

    // The second major method is the deQueue method. This is where a user can remove the item at the
    // front of the queue. This method doesn't take in any parameters.
    deQueue = () => {

        // If the queue is empty, then we cannot dequeue anything so we return an error, telling the
        // user that they attempted to dequeue from an empty queue.
        if (this.isEmpty()) {
            return new Error("Attempted to dequeue from an empty queue");
        // Then, if there is only one element, we need to set the front and rear pointers to -1. To
        // do this, we first need to check if there is only one element by comparing if the front pointer
        // and the rear pointer is equal.
        } else if (this.front === this.rear) {
            // If so, then we create a temporary constant for storing the item at the index stored in
            // front.
            const temp = this.items[this.front];
            // Then we set the item at this pointer to be undefined, in essence making the slot at that
            // index empty.
            this.items[this.front] = undefined;
            // Finally we set the front pointer and rear pointer to be -1, so that we know the queue
            // is empty.
            this.front = -1;
            this.rear = -1;
            // And return the temp constant that we created earlier.
            return temp;
        // If none of the above is true, then the queue must be in its 'regular' state, and we can perform
        // the normal operations.
        } else {
            // First create a temporary constant to store the item that was at the front pointer.
            const temp = this.items[this.front];
            // Then we set the new item to be undefined
            this.items[this.front] = undefined;
            // We increase the front pointer by 1, modding the length of the queue so that it 'loops'
            // back round if it was at the end.
            this.front = (this.front + 1) % this.maxLength;
            // Finally returning the stored constant from before.
            return temp;
        }
        
    }

}