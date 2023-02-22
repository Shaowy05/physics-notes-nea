import User from "./User";

export default class Teacher extends User {

    constructor(id, teacherCode, fn, ln, canPost, intake, isPrivate, department) {
        super(id, fn, ln, canPost, intake, isPrivate);

        this.teacherCode = teacherCode;
        this.department = department;

    }

}