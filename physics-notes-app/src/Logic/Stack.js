// Stack Class
export default class Stack {

    constructor() {
        this.items = [];
    }

    // Stack methods
    top = () => this.items[this.items.lastIndexOf];
    push = (item) => this.items.push(item);
    pop = () => this.items.pop();

    isEmpty = () => this.items.length === 0 ? true : false; 

}