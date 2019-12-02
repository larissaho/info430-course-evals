class WriteService {
    constructor(mssql) {
        this.connection = mssql;
    }

    async insertRating(firstName, lastName, courseNumber, courseName, rating, comment) {
        const request = new this.connection.Request();
        request.input('firstName', firstName);
        request.input('lastName', lastName);
        request.input('courseNumber', courseNumber);
        request.input('courseName', courseNumber);
        request.input('rating', rating);
        request.input('comment', comment);

        let response = {};
        await request.execute('insertRatings', (error, result) => {
            if (error !== null) {
                response = error;
                return;
            }

            console.log(result.recordsets);
        });

        return response;
    }
}

module.exports = WriteService;