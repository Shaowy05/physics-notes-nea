export default class Tag {

    constructor(index, id, name) {
        this.index = index;
        this.id = id;
        this.name = name;
        this.active = false;
    }

    toggleActive = () => {
        this.active = !this.active;
        console.log(this.active);
    }

}