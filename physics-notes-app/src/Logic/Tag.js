export default class Tag {

    constructor(index, id, name) {
        this.index = index;
        this.id = id;
        this.name = name;
        this.active = false;
    }

    // Set the active property to the opposite of itself using the NOT operator.
    toggleActive = () => {
        this.active = !this.active;
    }

}