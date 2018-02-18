import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from '../actions';

class MyPolls extends Component {
  componentDidMount() {
    this.props.fetchUserPolls();
  }
  
  renderPolls() {
    return _.map(this.props.userData, poll => {
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
  return {userData: state.data.userData};
}

export default connect(mapStateToProps, actions)(MyPolls);

