import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from '../actions';

class Polls extends Component {
  componentDidMount() {
    this.props.fetchAllPolls();
  }
  
  renderPolls() {
    return _.map(this.props.data, poll => {
      return (
        <li className="list-group-item poll-title" key={poll.pollId}>
          <Link to={`/polls/${poll.pollId}`}>
            {poll.title}
          </Link>
        </li>
      );
    });
  }
  
  render() {
    return (
      <div>
        <ul className="list-group">
          {this.renderPolls()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {data: state.data.data};
}

export default connect(mapStateToProps, actions)(Polls);

