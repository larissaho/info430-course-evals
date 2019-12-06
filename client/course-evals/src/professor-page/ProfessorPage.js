import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent, CircularProgress, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import ReadService from './../services/read';
import Eval from '../eval/Eval';

class ProfessorPage extends Component {
    constructor(props) {
        super(props);
        this.readService = new ReadService();

        this.state = {
            courses: [],
            reviews: [],
            selectedIndex: 0,
            displaySpinner: true,
            professorName: ""
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
                    <ListItem key={`prof-${i}`} style={{ cursor: "pointer" }}
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
                return <div key={`eval-${i}`}>
                    <Eval rating={e.rating} comment={e.comment} />
                </div>
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
                            <Card style={{ margin: "2% 0%", backgroundColor: "#eceff1" }}>
                                <div style={{display: "flex"}}>
                                    <CardHeader
                                        title={`${this.state.professorName}`}
                                        style={{ width: "90%" }} />
                                    
                                    <Link to={"/"} style={{ margin: "auto" }} >
                                        <HomeIcon fontSize={"large"} color={"primary"} />
                                    </Link>
                                </div>
                            </Card>

                            <div style={styles}>
                                <div style={{ width: "30%" }}>
                                    {this.courseNames(this.state.courses)}
                                </div>
                                <div>
                                    {this.courseEvals(this.state.reviews[this.state.selectedIndex])}
                                </div>
                            </div>

                            <Fab color={"secondary"} style={{ float: "right", margin: "7% 0" }} >
                                <AddIcon />
                            </Fab>
                        </div>
                }

            </Container>
        );
    }
}

export default withRouter(ProfessorPage);


