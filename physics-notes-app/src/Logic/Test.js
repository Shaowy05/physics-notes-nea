export default class Test {

    constructor(
        id,
        name,
        userId,
        testDate,
        attainedScore,
        maxScore
    ) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.testDate = testDate;
        this.attainedScore = attainedScore;
        this.maxScore = maxScore;
    }

    getParsedDate = () => this.testDate.split('T')[0];

}