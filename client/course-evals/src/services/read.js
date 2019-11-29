class ReadService {
    constructor() {
        this.domain = `http://localhost:4000`;
    }

    async getProfessorsWithFirstAndLastName(firstName, lastName) {
        let response = await fetch(`${this.domain}/search/professors?firstName=${firstName}&lastName=${lastName}`);
        let results = await response.json();
        return results;
    }

    async getCoursesWithCourseNumber(courseNumber) {
        let response = await fetch(`${this.domain}/search/courses?courseNumber=${courseNumber}`);
        let results = await response.json();
        return results;
    }
}

module.exports = ReadService;