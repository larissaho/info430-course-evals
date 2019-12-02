class ReadService {
    constructor(mssql) {
        this.connection = mssql;
    }

    async findProfessorsWithFirstAndLastName(firstName, lastName) {
        const result = await this.connection.query(`SELECT * FROM professors WHERE firstName='${firstName}' AND lastName='${lastName}'`);
        let recordSet = result.recordset;
        return recordSet;
    }

    async findCoursesWithNumber(courseName, courseNumber) {
        const result = await this.connection.query(`SELECT * FROM courses WHERE courseNumber='${courseNumber}' AND courseName='${courseName}'`);
        let recordSet = result.recordset;
        return recordSet;
    }

    async findRatingsByProfessorID(professorID) {
        const result = [];
        return result;
    }

    async findRatingsByCourseID(courseID) {
        const result = [];
        return result;
    }
}

module.exports = ReadService;