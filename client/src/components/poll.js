import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Doughnut} from 'react-chartjs-2';


// default google charts colors, top 20 choices, recommended here: http://there4.io/2012/05/02/google-chart-color-list/
const defaultColors = ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC'];

class Poll extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  
  componentWillMount() {
    this.props.clearPoll();
  }
  
  componentWillUpdate(nextProps) {
    if (nextProps.error && nextProps.error.response.data.error === "Poll does not exist") {
      this.context.router.history.push('/');
    }
  }
  
  componentDidMount() {
    const pathname = this.props.location.pathname;
    this.pollId = pathname.substring(pathname.lastIndexOf('/') + 1);
    
    this.props.getPollData(this.pollId);
  }
  
  handleFormSubmit({option}) {
    if (!option)
      return;
    
    this.props.voteOnPoll({pollId: this.pollId, option: option}, this.context.router.history);
  }
  
  renderError() {
    if (this.props.error) {
      return (
        <div className="alert alert-danger col-md-10 col-md-offset-1">
          <strong>Error!</strong> {this.props.error.response.data.error}
        </div>
      );
    }
  }
  
  renderForm() {
    // if no authentication, then render null
    if (!this.props.authenticated) {
      return null;
    }
    
    // if no pollData, then render null
    const pollData = this.props.pollData;
    if (!pollData)
      return null;
    
    const {handleSubmit} = this.props; // this.props comes from redux form
    
    return (
      <div className='col-md-10 col-md-offset-1' style={{borderStyle: 'solid'}}>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <div className='col-md-4'><Field name="option" component="select">
            <option/>
            {pollData.options.map((option, index) => {
              return <option value={option.name} key={index}>{option.name}</option>
            })}
          </Field>
            <button type='submit' className="btn btn-primary btn-block">Submit</button>
            <a target="_blank" href={`https://twitter.com/intent/tweet?url=https%3A%2F%2Ftesting-app.com%2Fpolls%2F${this.pollId}&text=${pollData.title} %7C Voting App`} className="btn btn-info btn-block"><i class="fa fa-twitter"></i> Share on Twitter</a>
          </div>
        </form>
      </div>
    );
  }
  
  renderPoll() {
    // if no pollData, then render null
    const pollData = this.props.pollData;
    if (!pollData)
      return null;
    
    const chartData = {
      datasets: [{
        data: pollData.options.map(option => {return option.votes;}),
        backgroundColor: _.range(pollData.options.length).map(i => {return defaultColors[Math.floor(i)];})
      }],
      labels: pollData.options.map(option => {return option.name;})
    };
    
    return (
      <div className={'col-md-10 col-md-offset-1'} style={{borderStyle: 'solid'}}>
        <Doughnut
          data={chartData}
        />
      </div>
    );
  }
  
  render() {
    return (
      <div className={'row'} style={{borderStyle: 'solid'}}>
        {this.renderPoll()}
        {this.renderForm()}
        {this.renderError()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {authenticated: state.auth.authenticated, pollData: state.data.pollData, error: state.data.error};
}

export default reduxForm({
  form: 'pollvote' // just an identifier for this form
})(
  connect(mapStateToProps, {...actions})(Poll)
);


