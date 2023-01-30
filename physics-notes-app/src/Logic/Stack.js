// Stack Class
export default class Stack {

    constructor() {
        this.items = [];
    }

    // Stack methods
    top = () => this.items[this.items.length - 1];
    push = (item) => this.items.push(item);
    pop = () => this.items.pop();
    getItems = () => this.items;

    isEmpty = () => this.items.length === 0 ? true : false; 

}