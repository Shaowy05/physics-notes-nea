export default class User {

    constructor(id, fn, ln, canPost, intake, isPrivate) {

        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.canPost = canPost;
        this.intake = intake;
        this.isPrivate = isPrivate;

    }

}