import React, { Component } from 'react';
import { Container, TextField, Radio, RadioGroup, FormControlLabel, Card, CardContent, CardHeader, Button, CardActions } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
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
        let courseName = this.state.searchTerm.split(" ");
        let courses = await this.readService.getCoursesWithCourseNumber(courseName[0], courseName[1]);
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
          label="Course Number | Professor Name"
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
      return (
        <div key={`c-${i}`} onClick={() => this.handleCourseSelection(c)}>
          <Link
            to={Routes.courseResult.replace(`:course`, `${c.courseID}`)}
            style={{ textDecoration: 'none' }}>
            <Card style={{ width: "30%", margin: "0% 2%", backgroundColor: "#fafafa", cursor: "pointer" }}>
              <CardHeader title={`${this.state.searchTerm}`}></CardHeader>
              <CardActions>
                <Button variant="contained" color="primary" >See Reviews</Button>
              </CardActions>
            </Card>
          </Link>
        </div>
      )
    });
  }

  professorResults = () => {
    let professors = this.state.professors;
    let professorCards = []
    professors.forEach((p, i) => {
      professorCards.push(
        <Card key={`p-${i}`} style={{ width: "30%", margin: "0% 2%", backgroundColor: "#fafafa", cursor: "pointer" }}
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
      <EvalsPage course={this.state.selectedCourse} />
    );
  }

  professorRatings = () => {
    return (
      <ProfessorPage professor={this.state.selectedProfessor} />
    );
  }

  render = () => {
    return (
      <Router>
        <Switch>
          <Route exact path={Routes.home}>
            {this.home()}
          </Route>
          <Route exact path={Routes.courseResult}>
            {this.evalsPage()}
          </Route>
          <Route exact path={Routes.professorResult}>
            {this.professorRatings()}
          </Route>
          <Redirect to={Routes.home}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
