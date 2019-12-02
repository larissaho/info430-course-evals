import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent, CircularProgress, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ReadService from './../services/read';

class ProfessorPage extends Component {
    constructor(props) {
        super(props);
        this.readService = new ReadService();

        this.state = {
            courses: [],
            reviews: [],
            selectedIndex: 0,
            displaySpinner: true
        }
    }

    async componentDidMount() {
        let pathname = this.props.location.pathname;
        let pathComponents = pathname.split("/");
        let professorID = parseInt(pathComponents[2]);
        if (!this.readService) {
            this.readService = new ReadService();
        }
        let results = await this.readService.getRatingsForProfessor(professorID);

       
        let professorName = results.length > 0 ? `${results[0].firstName} ${results[0].lastName}` : "";
        let courses = results.map((rating) => { return `${rating.courseName} ${rating.courseNumber}` });
        let reviews = results.map((rating) => { return rating.reviews });

        this.setState({
            professorName: professorName,
            courses: courses,
            reviews: reviews,
            displaySpinner: false
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
        }, () => {
            console.log(this.state.selectedIndex)
        });
    }


    render() {
        const styles = {
            display: "flex",
        };

        return (
            <Container>
                {
                    this.state.displaySpinner ?
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "25% 0" }}><CircularProgress /></div>
                        :
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
                                    {this.courseEvals(this.state.reviews[this.state.selectedIndex])}
                                </div>
                            </div>

                            <Fab color={"secondary"}>
                                <AddIcon />
                            </Fab>

                            {/* <Fab color={"primary"} aria-label={"add"}>
                                
                            </Fab> */}
                        </div>
                }

            </Container>
        );
    }
}

export default withRouter(ProfessorPage);


