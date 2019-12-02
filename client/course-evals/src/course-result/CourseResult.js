import React, { Component } from 'react';
import { Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';


class CourseResultCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardHeader title={`${this.props.course.courseName} ${this.props.course.courseNumber}`}></CardHeader>
                <CardActions>
                    <Button variant="contained" color="primary" >See Reviews</Button>
                </CardActions>
            </Card>
        );
    }
}

export default CourseResultCard;