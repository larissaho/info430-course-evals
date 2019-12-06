class WriteService {
    constructor() {
        this.domain = `https://intense-everglades-51660.herokuapp.com`; //`http://localhost:4000`;
    }

    async insertNewRating(data) {
        const response = await fetch(`${this.domain}/ratings`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response;
    }
}

module.exports = WriteService;