import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField } from '@material-ui/core';
import WriteService from './../services/write';

class EvalForm extends Component {
    constructor(props) {
        super(props);
        this.writeService = new WriteService();

        this.state = {
            courseName: "",
            professorName: "",
            rating: "",
            comment: ""
        };
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value
        });
    }

    onSubmit = async () => {
        if (this.state.courseName.length > 0 && this.state.professorName.length > 0 && this.state.comment.length > 0) {
            let rating = parseInt(this.state.rating);
            let comment = this.state.comment;

            if (!isNaN(rating)) {
                let course = this.state.courseName.split(" ");
                let courseName = course[0];
                let courseNumber = parseInt(course[1]);

                let name = this.state.professorName.split(" ");
                let firstName = name.length <= 2 ? name[0] : "";
                let lastName = name.length <= 2 ? name[1] : "";

                let body = {
                    firstName: firstName,
                    lastName: lastName,
                    courseNumber: courseNumber,
                    courseName: courseName,
                    rating: rating,
                    comment: comment
                };

                let resp = await this.writeService.insertNewRating(body);
                this.props.toggleForm();
            }
        }
    }

    render() {
        const fieldStyle = {
            margin: "2% 0"
        };

        return (
            <Dialog open={this.props.isOpen} onBackdropClick={() => {this.props.toggleForm()}}>
                <DialogTitle>New Rating</DialogTitle>
                <DialogContent>
                    <TextField label={"Course Name"} 
                               value={this.state.courseName} 
                               placeholder={"INFO 350"}
                               onChange={(evt) => {this.onChange("courseName", evt.target.value)}}
                               fullWidth
                               style={fieldStyle} />
                    <TextField label={"Professor Name"} 
                               value={this.state.professorName} 
                               placeholder={"John Doe"}
                               onChange={(evt) => { this.onChange("professorName", evt.target.value) }}
                               fullWidth
                               style={fieldStyle} />
                    <TextField label={"Rating"}
                               value={this.state.rating}
                               placeholder={"4"}
                               onChange={(evt) => { this.onChange("rating", evt.target.value) }}
                               fullWidth
                               style={fieldStyle} />
                    <TextField label={"Comment"}
                               value={this.state.comment}
                               placeholder={""}
                               onChange={(evt) => { this.onChange("comment", evt.target.value) }}
                               fullWidth
                               style={fieldStyle} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.onSubmit() }} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default EvalForm;