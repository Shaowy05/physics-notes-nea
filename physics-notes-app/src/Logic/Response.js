export default class Response {

    constructor(responseId, responseText, authorId, questionId, isSolution) {
        this.id = responseId;
        this.text = responseText;
        this.authorId = authorId;
        this.questionId = questionId;
        this.isSolution = isSolution;
    }

}