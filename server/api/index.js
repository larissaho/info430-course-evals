const express = require('express');
const PORT = 4000;

const app = express();

app.get('/', function (req, res) {
    res.send('Course Evals API')
})

app.listen(PORT, () => {
    console.log("Access API at: http://localhost:4000")
});