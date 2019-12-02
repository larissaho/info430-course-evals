import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent, CircularProgress } from '@material-ui/core';
import ReadService from './../services/read';

class ProfessorPage extends Component {
    constructor(props) {
        super(props);
        this.readService = new ReadService();
        this.displaySpinner = true;

        this.state = {
            courses: [],
            courseEvals: [],
            selectedIndex: 0
        }
    }

    async componentDidMount() {
        let pathname = this.props.location.pathname;
        let pathComponents = pathname.split("/");
        let professorID = parseInt(pathComponents[2]);
        if (!this.readService) {
            this.readService = new ReadService();
        }
        let results = await this.readService.getRatingsForCourse(professorID);

        let courses = results.map((rating) => { return rating.courseName });
        let courseEvals = results.map((rating) => { return rating.courseEvals });

        this.setState({
            courses: courses,
            courseEvals: courseEvals
        }, () => {
            this.displaySpinner = false;
        });
    }

    courseNames = (courses) => {
        if (courses) {
            return courses.map((c, i) => {
                return (
                    <ListItem key={`prof-${i}`}
                        selected={this.state.selectedIndex === i}
                        onClick={() => { this.selectCourse(i) }} >
                        <ListItemText primary={c} />
                    </ListItem>
                )
            });
        }
    }

    courseEvals = (evals) => {
        if (evals) {
            return evals.map((e, i) => {
                return <div></div>
            });
        }
    }

    selectCourse = (index) => {
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
                                <CardHeader
                                    title={`${this.props.professor.firstName} ${this.props.professor.lastName}`}
                                    style={{ backgroundColor: "#303f9f", color: "#fff" }} />
                            </Card>

                            <div style={styles}>
                                <div style={{ width: "30%" }}>
                                    {this.courseNames(this.state.courses)}
                                </div>
                                <div>
                                    {this.courseEvals(this.state.courseEvals[this.state.selectedIndex])}
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

export default withRouter(ProfessorPage);