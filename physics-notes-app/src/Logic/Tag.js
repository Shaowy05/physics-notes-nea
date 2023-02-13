export default class Tag {

    constructor(id, name, active) {
        this.id = id;
        this.name = name;
        this.active = false;
    }

    toggleActive = () => {
        this.active = !this.active;
        console.log(this.active);
    }

}