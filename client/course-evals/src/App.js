import React, { Component } from 'react';
import { Container, TextField, Radio, RadioGroup, FormControlLabel, Card, CardContent } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import CourseResultCard from './course-result/CourseResult';
import EvalsPage from './evals-page/EvalsPage';
import ProfessorPage from './professor-page/ProfessorPage';
import ReadService from './services/read';

const Routes = {
  home: "/",
  courseResult: "/course/:course",
  professorResult: "/professor/:professor"
};

const data = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.readService = new ReadService();

    this.state = {
      searchTerm: "",
      searchField: "course",
      professors: [],
      courses: [],
      selectedProfessor: {},
      selectedCourse: {}
    };
  }

  updateSearchInput = (evt) => {
    evt.preventDefault();
    this.setState({
      searchTerm: evt.target.value
    });
  }

  submitSearchInput = async (evt) => {
    evt.preventDefault();
    if (evt.key === 'Enter') {
      if (this.state.searchField === "course") {
        let courses = await this.readService.getCoursesWithCourseNumber(this.state.searchTerm);
        this.setState({
          courses: courses
        });
      } else {
        let name = this.state.searchTerm.split(" ");
        let professors = [];
        if (name.length === 2) {
          professors = await this.readService.getProfessorsWithFirstAndLastName(name[0], name[1]);
        } else {
          professors = await this.readService.getProfessorsWithFirstAndLastName(name[0], "");
        }
        this.setState({
          professors: professors
        });
      }
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
          this.state.searchField === "course" ? this.courseResults() : this.professorResults()
        }
      </Container>
    );
  }

  handleCourseSelection = (c) => {
    this.setState({
      selectedCourse: c
    });
  }

  handleProfessorSelection = (p) => {
    this.setState({
      selectedProfessor: p
    });
  }

  courseResults = () => {
    let courses = this.state.courses;
    return courses.map((c, i) => {
      return <div onClick={() => this.handleCourseSelection(c)}><CourseResultCard /></div>
    });
  }

  professorResults = () => {
    let professors = this.state.professors;
    let professorCards = []
    professors.forEach((p, i) => {
      professorCards.push(
        <Card style={{ width: "30%", margin: "0% 2%", backgroundColor: "#fafafa", cursor: "pointer" }}
          onClick={() => this.handleProfessorSelection(p)}>
          <Link
            to={Routes.professorResult.replace(`:professor`, `${p.profID}`)}
            style={{ textDecoration: 'none' }}>
            <CardContent>
              <p>{`${p.firstName} ${p.lastName}`}</p>
            </CardContent>
          </Link>
        </Card>
      );
    });

    return <div style={{ display: "flex", flexDirection: "wrap", fontFamily: "Lato", fontSize: "1.1em" }}>{professorCards}</div>;
  }

  evalsPage = () => {
    return (
      <EvalsPage course={this.state.selectedCourse} ratings={[]} />
    );
  }

  professorRatings = () => {
    return (
      <ProfessorPage professor={this.state.selectedProfessor} ratings={[]}/>
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
