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
        const request = new this.connection.Request();
        request.input('P_ID', professorID);

        let result = await request.execute('return_prof_reviews');
        let rows = result.recordsets[0];
        let byCourse = {};

        rows.forEach((row, i) => {
            let courseID = row.courseID;
            let data = {};
            let reviews = [];
        
            if (byCourse[courseID]) {
                data = byCourse[courseID];
                reviews = data.reviews;
            } else {
                data = {
                    courseID: row.courseID,
                    courseNumber: row.courseNumber,
                    courseName: row.courseName,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    reviews: reviews
                };
            }

            let r = {
                rating: row.rating,
                comment: row.comment
            };
            reviews.push(r);
            data.reviews = reviews;
            byCourse[courseID] = data;
        });

        let response = Object.values(byCourse);
        return response;
    }

    async findRatingsByCourseID(courseID) {
        const request = new this.connection.Request();
        request.input('C_ID', courseID);

        let result = await request.execute('return_course_reviews');
        let rows = result.recordsets[0];
        let byProf = {};

        rows.forEach((row, i) => {
            let profID = row.profID;
            let data = {};
            let reviews = [];

            if (byProf[profID]) {
                data = byProf[profID];
                reviews = data.reviews;
            } else {
                data = {
                    profID: row.profID,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    courseNumber: row.courseNumber,
                    courseName: row.courseName,
                    reviews: reviews,
                };
            }

            let r = {
                rating: row.rating,
                comment: row.comment
            };
            reviews.push(r);
            data.reviews = reviews;
            byProf[profID] = data;
        });

        let response = Object.values(byProf);
        return response;
    }
}

module.exports = ReadService;