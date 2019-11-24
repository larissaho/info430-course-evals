const express = require('express');
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

        // start server
        this.app.listen(PORT, () => {
            console.log(`Access API at: http://localhost:${PORT}`);
        });
    }
}

const app = new App();
app.startServer();


