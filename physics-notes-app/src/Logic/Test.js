// Exporting the Test class
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
        // We instantiate the test date using the Date object prototype.
        this.testDate = new Date(testDate);
        this.attainedScore = attainedScore;
        this.maxScore = maxScore;
    }

    // This method returns a cleaner more readable form of the test date. Note this does not return
    // the time, only the date.
    getParsedDate = () => this.testDate.toISOString().split('T')[0];
    // This returns a rounded percentage of the score of this test. This is used in the graph in the
    // profile page.
    getRoundedPercentage = () => Math.round((this.attainedScore / this.maxScore) * 100);

}