class ReadService {
    constructor(mssql) {
        this.connection = mssql;
    }

    async getReviewsByCourseNumber(courseNumber) {
        const result = await this.connection.query`select * from INFO430.podcasts_akkarh where podcastID = ${1}`;
        return result;
    }

    async findProfessorsWithFirstAndLastName(firstName, lastName) {
        const result = await this.connection.query(`SELECT * FROM professors WHERE firstName='${firstName}' AND lastName='${lastName}'`);
        let recordSet = result.recordset;
        return recordSet;
    }

    async findCoursesWithNumber(courseNumber) {
        const result = await this.connection.query(`SELECT * FROM courses WHERE courseNumber='${courseNumber}'`);
        let recordSet = result.recordset;
        return recordSet;
    }
}

module.exports = ReadService;