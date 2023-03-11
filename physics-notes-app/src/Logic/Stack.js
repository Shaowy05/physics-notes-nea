// Exporting the Stack class
export default class Stack {

    // PROPERTIES ==================================================================================
    // The only thing needed in the stack is the items array, since Javascript supports the pop and
    // push functions by default on the array therefore no top pointer is required.
    constructor() {
        this.items = [];
    }
    // =============================================================================================

    // METHODS =====================================================================================
    // The first method is top, which simply returns the front item of the array, without performing
    // any operation on it.
    top = () => {
        
        // If the stack is empty then return an error.
        if (this.isEmpty()) {
            return new Error('Cannot display top item of an empty stack');
        }

        return this.items[this.items.length - 1];
    }
    // Push adds an item to the top of the stack.
    push = (item) => this.items.push(item);
    // Pop removes and returns the top item of the stack.
    pop = () => {

        // First check if the stack is empty, if so return an error to escape out the function.
        if (this.isEmpty()) {
            return new Error('Attempted to pop from empty stack');
        }

        this.items.pop();
    }
    // Get items is just a more descriptive way of getting all the items in the stack.
    getItems = () => this.items;

    // Is empty is a method for checking whether or not the length of the array is 0. Here we use the
    // conditional ternary operator to make the syntax more compact.
    isEmpty = () => this.items.length === 0 ? true : false; 
    // =============================================================================================

}