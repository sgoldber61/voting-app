import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import * as actions from '../../actions';


class Signin extends Component {
  handleFormSubmit({email, password}) {
    console.log(email, password);
    // Need to do something to log user in
    
    console.log(this.props);
    
    this.props.signinUser({email, password}, this.props.history);
  }
  
  renderField(field) {
    return (
      <div className="form-group">
        <label>{field.label}</label>
        <input
          className="form-control"
          type={field.input.name === "password" ? "password" : "text"}
          {...field.input}
        />
      </div>
    );
  }
  
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }
  
  render() {
    const {handleSubmit} = this.props; // this.props comes from redux form
    
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <Field name='email' label='Email' component={this.renderField} />
        <Field name='password' label='Password' component={this.renderField} />
        {this.renderAlert()/*for rendering an error message*/}
        <button type="submit" className="btn btn-primary">Sign in</button>
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
  connect(mapStateToProps, {...actions})(Signin)
);


