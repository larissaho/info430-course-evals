import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent, CircularProgress, Fab } from '@material-ui/core';
import Eval from './../eval/Eval';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import ReadService from './../services/read';
import EvalForm from './../new-eval/EvalForm';

class EvalsPage extends Component {
    constructor(props) {
        super(props);
        this.readService = new ReadService();

        this.state = {
            selectedIndex: 0,
            professors: [],
            reviews: [],
            displaySpinner: true,
            evalForm: false
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

        let professors = results.map((rating) => { return `${rating.firstName} ${rating.lastName}` });
        let reviews = results.map((rating) => { return rating.reviews });
        let courseName = results.length > 0 ? `${results[0].courseName} ${results[0].courseNumber}` : "";

        this.setState({
            courseName: courseName,
            professors: professors,
            reviews: reviews,
            displaySpinner: false
        });
    }

    professorNames = (professors) => {
        return professors.map((p, i) => {
            return (
                <ListItem key={`prof-${i}`} style={{ cursor: "pointer" }}
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
                return <Eval key={`review-${i}`} rating={r.rating} comment={r.comment}></Eval>
            });
        }
    }

    selectProfessor = (index) => {
        this.setState({
            selectedIndex: index
        });
    }

    toggleForm = () => {
        this.setState({ evalForm: !this.state.evalForm });
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
                                <div style={{ display: "flex" }}>
                                    <CardHeader title={`${this.state.courseName}`} 
                                        style={{ width: "90%" }}/>
                                    <Link to={"/"} style={{ margin: "auto" }} >
                                        <HomeIcon fontSize={"large"} color={"primary"} />
                                    </Link>
                                </div>
                            </Card>

                            <div style={styles}>
                                <div style={{ width: "30%" }}>
                                    {this.professorNames(this.state.professors)}
                                </div>
                                <div>
                                    {this.reviews(this.state.reviews[this.state.selectedIndex])}
                                </div>
                            </div>

                            <Fab color={"secondary"} 
                                 style={{ float: "right", margin: "7% 0" }} 
                                onClick={() => {this.toggleForm() }}>
                                <AddIcon />
                            </Fab>
                            <EvalForm isOpen={this.state.evalForm} toggleForm={this.toggleForm} />
                        </div>
                        
                }
            </Container>
        );
    }
}

export default withRouter(EvalsPage);


