class ReadService {
    constructor() {
        this.domain = `http://localhost:4000`;
    }

    async getProfessorsWithFirstAndLastName(firstName, lastName) {
        let response = await fetch(`${this.domain}/search/professors?firstName=${firstName}&lastName=${lastName}`);
        let results = await response.json();
        return results;
    }

    async getCoursesWithCourseNumber(courseName, courseNumber) {
        let response = await fetch(`${this.domain}/search/courses?courseNumber=${courseNumber}&courseName=${courseName}`);
        let results = await response.json();
        return results;
    }

    async getRatingsForCourse(courseID) {
        let response = await fetch(`${this.domain}/ratings/?courseID=${courseID}`);
        let results = await response.json();
        return results;
    }

    async getRatingsForProfessor(professorID) {
        let response = await fetch(`${this.domain}/ratings/?professorID=${professorID}`);
        let results = await response.json();
        return results;
    }
}

module.exports = ReadService;