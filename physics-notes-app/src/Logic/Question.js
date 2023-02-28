export default class Question {

    constructor(questionId, questionTitle, questionText, authorId, noteId, uploadDate, responses = []) {
        this.id = questionId;
        this.title = questionTitle;
        this.text = questionText;
        this.authorId = authorId;
        this.noteId = noteId;
        this.uploadDate = uploadDate;
        this.responses = responses;
    }

    addResponse = response => this.responses.push(response);

    hasResponses = () => this.responses.length === 0 ? false : true;

}