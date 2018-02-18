import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import * as actions from '../actions';


class NewPoll extends Component {
  handleFormSubmit({title, options}) {
    this.props.createNewPoll({title, options: options.split("\n")}, this.props.history);
  }
  
  renderField(field) {
    return (
      <div className="form-group">
        <label>{field.label}</label>
        {field.input.name === 'title'? <input
          className="form-control"
          type={"text"}
          {...field.input}
        /> :
        <textarea
          className="form-control"
          rows="5"
          {...field.input}
        />}
      </div>
    );
  }
  
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Error!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }
  
  render() {
    const {handleSubmit} = this.props; // this.props comes from redux form
    
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <Field name='title' label='Title' component={this.renderField} />
        <Field name='options' label='Options (seperated by line)' component={this.renderField} />
        {this.renderAlert()/*for rendering an error message*/}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
}


function mapStateToProps(state) {
  return {errorMessage: state.auth.error};
}


export default reduxForm({
  form: 'signin' // just an identifier for this form
})(
  connect(mapStateToProps, {...actions})(NewPoll)
);


