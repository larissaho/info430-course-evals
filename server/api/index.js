const express = require('express');
const cors = require('cors')
const mssql = require('mssql');
const PORT = 4000;
const config = require('./credentials.json');
const ReadService = require('./read.js');

class App {
    constructor() {
        this.app = express();
        this.connect();
    }

    async connect() {
        await mssql.connect(config, (error) => {
            if (error) {
                console.log(error);
                return;
            }

            this.readService = new ReadService(mssql);
        });
    }

    startServer() {
        // enable cross origin requests
        this.app.use(cors());

        // add services
        this.app.get('/', function (req, res) {
            res.send('Course Evals API')
        });

        // reviews?course=INFO430
        this.app.get('/reviews', async (req, res) => {
            let courseNumber = req.query.course;
            let reviews = await this.readService.getReviewsByCourseNumber(courseNumber);
            res.send(reviews);
        });

        // search/professors?firstName=Amy&lastName=Ko
        this.app.get('/search/professors', async (req, res) => {
            let firstName = req.query.firstName;
            let lastName = req.query.lastName;
            let matches = await this.readService.findProfessorsWithFirstAndLastName(firstName, lastName);
            res.json(matches);
        });

        // search/courses?courseNumber=INFO 430
        this.app.get('/search/courses', async (req, res) => {
            let courseNumber = req.query.courseNumber;
            let matches = await this.readService.findCoursesWithNumber(courseNumber);
            res.json(matches);
        });

        // start server
        this.app.listen(PORT, () => {
            console.log(`Access API at: http://localhost:${PORT}`);
        });
    }
}

const app = new App();
app.startServer();


