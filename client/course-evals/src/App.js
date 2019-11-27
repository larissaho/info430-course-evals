import React, { Component } from 'react';
import { Container, TextField, Radio, RadioGroup, FormControlLabel, Card, CardContent } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CourseResultCard from './course-result/CourseResult';
import EvalsPage from './evals-page/EvalsPage';
import ProfessorPage from './professor-page/ProfessorPage';

const Routes = {
  home: "/",
  courseResult: "/course/:course",
  professorResult: "/professor/:professor"
}

const data = [
  {
    professorName: "Greg Hay",
    reviews: ["a", "b", "c"]
  },
  {
    professorName: "Amy Ko",
    reviews: ["a", "b", "c"]
  },
  {
    professorName: "David Ewald",
    reviews: ["a", "b", "c"]
  }
];

const professorData = [
  {
    courseName: "INFO 200",
    courseEvals: []
  },
  {
    courseName: "INFO 360",
    courseEvals: []
  }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      searchField: "course"
    };
  }

  updateSearchInput = (evt) => {
    evt.preventDefault();
    this.setState({
      searchTerm: evt.target.value
    });
  }

  submitSearchInput = (evt) => {
    evt.preventDefault();
    if (evt.key === 'Enter') {
    }
  }

  selectSearchField = (evt) => {
    evt.preventDefault();
    this.setState({
      searchField: evt.target.value
    });
  }

  home = () => {
    const style = {
      display: "flex"
    };

    return (
      <Container>
        <TextField
          value={this.state.searchTerm}
          id="standard-search"
          label="Course Number | Professor"
          type="search"
          className={""}
          margin="normal"
          fullWidth={true}
          onChange={evt => { this.updateSearchInput(evt) }}
          onKeyUp={evt => { this.submitSearchInput(evt) }}
        />
        <RadioGroup value={this.state.searchField} onChange={(evt) => this.selectSearchField(evt)}>
          <div style={style}>
            <FormControlLabel value="course" control={<Radio />} label="Course" />
            <FormControlLabel value="professor" control={<Radio />} label="Professor" />
          </div>
        </RadioGroup>
        <br /><br /><br />

        {
          this.state.searchField == "course" ? this.courseResults() : this.professorResults()
        }
      </Container>
    );
  }

  courseResults = () => {
    return <CourseResultCard />
  }

  professorResults = () => {
    let professors = ["Amy Ko", "David Ewald", "Greg Hay"];
    let professorCards = []
    professors.forEach((p, i) => {
      professorCards.push(<Card style={{ width: "30%", margin: "0% 2%", backgroundColor: "#fafafa"}}><CardContent><p>{p}</p></CardContent></Card>);
    });

    return <div style={{ display: "flex", flexDirection: "wrap", fontFamily: "Lato", fontSize: "1.1em"}}>{professorCards}</div>;
  }

  evalsPage = () => {
    return (
      <EvalsPage courseTitle={"INFO 430"} ratings={data} />
    );
  }

  professorRatings = () => {
    return (
      <ProfessorPage professorName={"Amy Ko"} ratings={professorData}/>
    );
  }

  render = () => {
    return (
      <Router>
        <Switch>
          <Route exact path={Routes.home}>
            {this.home()}
          </Route>
          <Route path={Routes.courseResult}>
            {this.evalsPage()}
          </Route>
          <Route path={Routes.professorResult}>
            {this.professorRatings()}
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
