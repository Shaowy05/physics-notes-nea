// Class for a Circular Queue
export default class CircularQueue {

    constructor(maxLength) {
        this.maxLength = maxLength;
        this.items = [];
        this.front = -1;
        this.rear = -1;
    }

    // Circular Queue Methods

    isFull = () => (((this.rear + 1) % this.maxLength) === this.front) ? true : false 
    isEmpty = () => (this.front === -1) ? true : false

    getFrontOfQueue = () => this.front === -1 ? false : this.items[this.front];

    enQueue = item => {

        // First check if the queue is full
        if (this.isFull()) {
            throw new Error("Attempted to enqueue to a full queue");
        // Then check if it is empty
        } else if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
            this.items[0] = item;
        // Finally if neither are true
        } else {
            this.rear = (this.rear + 1) % this.maxLength;
            this.items[this.rear] = item;
        }

    }

    deQueue = () => {

        // First check if queue is empty
        if (this.isEmpty()) {
            throw new Error("Attempted to dequeue from an empty queue");
        // Then if there is only one element
        } else if (this.front === this.rear) {
            const temp = this.items[this.front];
            this.front = -1;
            this.rear = -1;
            this.items.splice(0, 1);
            return temp;
        // Finally if the queue is regular
        } else {
            const temp = this.items[this.front];
            this.front = (this.front + 1) % this.maxLength;
            return temp;
        }
        
    }

}