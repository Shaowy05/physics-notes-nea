export default class User {

    constructor(id, fn, ln, canPost, intake, isPrivate, numOfPosts) {

        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.canPost = canPost;
        this.intake = intake;
        this.isPrivate = isPrivate;
        this.numOfPosts = numOfPosts;

    }

    updateNumOfPosts = nOP => this.numOfPosts = nOP;

    updateIsPrivate = iP => {
        if (this.isPrivate !== iP) {
            this.isPrivate = iP;
        }

        return this.isPrivate;
    }

}