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
        this.testDate = new Date(testDate);
        this.attainedScore = attainedScore;
        this.maxScore = maxScore;
    }

    getParsedDate = () => this.testDate.toISOString().split('T')[0];
    getRoundedPercentage = () => Math.round((this.attainedScore / this.maxScore) * 100);

}