import React, { Component } from 'react';
import {Container, TextField} from '@material-ui/core';
import CourseResultCard from './course-result/CourseResult';

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
      // TODO: Make an API Call
    }
  }

  render = () => {
    return (
      <Container maxWidth="xl">
        <p>Course Evals</p>
        <TextField
          value={this.state.searchTerm}
          id="standard-search"
          label="Course Title"
          type="search"
          className={""}
          margin="normal"
          fullWidth={true}
          onChange={evt => {this.updateSearchInput(evt)}}
          onKeyUp={evt => {this.submitSearchInput(evt)}}
        />
        <CourseResultCard/>
         
      </Container>
    );
  }
}

export default App;
