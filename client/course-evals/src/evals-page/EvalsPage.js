import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent, CircularProgress } from '@material-ui/core';
import Eval from './../eval/Eval';
import ReadService from './../services/read';

class EvalsPage extends Component {
    constructor(props) {
        super(props);
        this.readService = new ReadService();
        this.displaySpinner = true;

        this.state = {
            selectedIndex: 0,
            professors: [],
            reviews: []
        }
    }

    async componentDidMount() {
        let pathname = this.props.location.pathname;
        let pathComponents = pathname.split("/");
        let courseID = parseInt(pathComponents[2]);
        if (!this.readService) {
            this.readService = new ReadService();
        }
        let results = await this.readService.getRatingsForCourse(courseID);
        let professors = results.map((rating) => { return rating.professorName });
        let reviews = results.map((rating) => { return rating.reviews });
        this.setState({
            professors: professors,
            reviews: reviews
        }, () => {
            this.displaySpinner = false;
        });
    }

    professorNames = (professors) => {
        return professors.map((p, i) => {
            return (
                <ListItem key={`prof-${i}`}
                    selected={this.state.selectedIndex === i}
                    onClick={() => { this.selectProfessor(i) }} >
                    <ListItemText primary={p} />
                </ListItem>
            )
        });
    }

    reviews = (reviews) => {
        if (reviews) {
            return reviews.map((r, i) => {
                return <Eval></Eval>
            });
        }
    }

    selectProfessor = (index) => {
        this.setState({
            selectedIndex: index
        });
    }


    render() {
        const styles = {
            display: "flex",
        };

        return (
            <Container>
                {
                    this.displaySpinner ?
                        <div>
                            <Card style={{ margin: "2% 0%" }}>
                                <CardHeader title={`${this.props.course.courseName} ${this.props.course.courseNumber}`} style={{ backgroundColor: "#303f9f", color: "#fff" }} />
                            </Card>

                            <div style={styles}>
                                <div style={{ width: "30%" }}>
                                    {this.professorNames(this.state.professors)}
                                </div>
                                <div>
                                    {this.reviews(this.state.reviews[this.state.selectedIndex])}
                                </div>
                            </div>
                        </div>
                        :
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "25% 0" }}><CircularProgress /></div>
                }
            </Container>
        );
    }
}

export default withRouter(EvalsPage);