import React, { Component } from 'react';
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent, CircularProgress } from '@material-ui/core';

class ProfessorPage extends Component {
    constructor(props) {
        super(props);
        // let courseNames = this.props.ratings.map((rating) => { return rating.courseName });
        // let courseEvals = this.props.ratings.map((rating) => { return rating.courseEvals });
        this.state = {
            courseNames: [],
            courseEvals: [],
            selectedIndex: 0
        }
    }

    courseNames = (courses) => {
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

    courseEvals = (evals) => {
        return evals.map((e, i) => {
            return <div></div>
        });
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
                    Object.keys(this.props.professor).length > 0 ?
                        <div>
                            <Card style={{ margin: "2% 0%" }}>
                                <CardHeader
                                    title={`${this.props.professor.firstName} ${this.props.professor.lastName}`}
                                    style={{ backgroundColor: "#303f9f", color: "#fff" }} />
                            </Card>

                            <div style={styles}>
                                <div style={{ width: "30%" }}>
                                    {/* {this.courseNames(this.state.courseNames)} */}
                                </div>
                                <div>
                                    {/* {this.courseEvals(this.state.courseEvals[this.state.selectedIndex])} */}
                                </div>
                            </div>
                        </div>
                        :
                        <div style={{width: "100%", display: "flex", justifyContent: "center", margin: "25% 0"}}><CircularProgress /></div>
                }

            </Container>
        );
    }
}

export default ProfessorPage;