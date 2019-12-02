const express = require('express');
const cors = require('cors')
const mssql = require('mssql');
const PORT = 4000;
const config = require('./credentials.json');
const ReadService = require('./read.js');
const WriteService = require('./write.js')

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
            this.writeService = new WriteService(mssql);
        });
    }

    startServer() {
        this.app.use(cors()); // enable cross origin requests
        this.app.use(express.json()); // request body will be parsed as a json object

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

        // search/courses?courseNumber=430&courseName=INFO
        this.app.get('/search/courses', async (req, res) => {
            let courseNumber = req.query.courseNumber;
            let courseName = req.query.courseName;
            let matches = await this.readService.findCoursesWithNumber(courseName, courseNumber);
            res.json(matches);
        });

        // ratings/
        this.app.post('/ratings', async (req, res) => {
            let body = req.body;
            let row = await this.writeService.insertRating(
                body.firstName,
                body.lastName,
                body.courseNumber,
                body.courseName,
                body.rating,
                body.comment
            );

            res.status(201);
            res.send("end point works");
        });

        // ratings/professorID=1&courseID=3
        this.app.get('/ratings', async (req, res) => {
            let professorID = req.query.professorID;
            let courseID = req.query.courseID;
            let reviews = [];

            if (!professorID && !courseID) {
                res.status(400);
                res.send('This endpoint requires at most one of the 2 query parameters: professorID and courseID');
                return;
            } else if (professorID && courseID) {
                res.status(400);
                res.send('This endpoint requires at most one of the 2 query parameters: professorID and courseID');
                return;
            } else if (professorID) {
                reviews = await this.readService.findRatingsByProfessorID(professorID);
            } else if (courseID) {
                reviews = await this.readService.findRatingsByCourseID(courseID);
            }

            res.send(reviews);
        });

        // start server
        this.app.listen(PORT, () => {
            console.log(`Access API at: http://localhost:${PORT}`);
        });
    }
}

const app = new App();
app.startServer();


