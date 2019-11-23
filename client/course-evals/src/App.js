import React, { Component } from 'react';
import { Container, TextField } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import CourseResultCard from './course-result/CourseResult';
import EvalsPage from './evals-page/EvalsPage';

const Routes = {
  home: "/",
  results: "/:course"
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
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
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

  home = () => {
    return (
      <Container>
        <TextField
          value={this.state.searchTerm}
          id="standard-search"
          label="Course Number"
          type="search"
          className={""}
          margin="normal"
          fullWidth={true}
          onChange={evt => { this.updateSearchInput(evt) }}
          onKeyUp={evt => { this.submitSearchInput(evt) }}
        />
        <br /><br /><br />
        
        <CourseResultCard />
      </Container>
    );
  }

  evalsPage = () => {
    return (
      <EvalsPage courseTitle={"INFO 430"} ratings={data} />
    );
  }


  render = () => {
    return (
      <Router>
        <Switch>
          <Route exact path={Routes.home}>
            {this.home()}
          </Route>
          <Route path={Routes.results}>
            {this.evalsPage()}
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
