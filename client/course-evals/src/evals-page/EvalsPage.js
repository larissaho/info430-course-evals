import React, { Component } from 'react';
import { ListItem, ListItemText, Container, Card, CardHeader, CardContent } from '@material-ui/core';
import Eval from './../eval/Eval';

class EvalsPage extends Component {
    constructor(props) {
        super(props);
        let professorNames = this.props.ratings.map((rating) => { return rating.professorName });
        let reviews = this.props.ratings.map((rating) => { return rating.reviews });
        this.state = {
            professors: professorNames,
            reviews: reviews,
            selectedIndex: 0
        }
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
        return reviews.map((r, i) => {
            return <Eval></Eval>
        });
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
                <Card style={{ margin: "2% 0%" }}>
                    <CardHeader title={"INFO 430"} style={{ backgroundColor: "#303f9f", color: "#fff" }} />
                </Card>

                <div style={styles}>
                    <div style={{ width: "30%" }}>
                        {this.professorNames(this.state.professors)}
                    </div>
                    <div>
                        {this.reviews(this.state.reviews[this.state.selectedIndex])}
                    </div>
                </div>
            </Container>
        );
    }
}

export default EvalsPage;