// Importing the User class so we can inherit from it.
import User from "./User";
// Exporting the Teacher class.
export default class Teacher extends User {

    constructor(id, teacherCode, fn, ln, canPost, intake, isPrivate, department) {
        // Here we call the super function to execute the constructor belonging to the User class.
        super(id, fn, ln, canPost, intake, isPrivate);

        this.teacherCode = teacherCode;
        this.department = department;

    }

}