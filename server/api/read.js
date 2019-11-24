class ReadService {
    constructor(mssql) {
        this.connection = mssql;
    }

    async getReviewsByCourseNumber(courseNumber) {
        const result = await this.connection.query`select * from INFO430.podcasts_akkarh where podcastID = ${1}`;
        return result;
    }
}

module.exports = ReadService;