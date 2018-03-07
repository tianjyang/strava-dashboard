import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Aux from '../hoc/Aux';
import Calendar from '../Dashboard/Calendar/Calendar';
import Summary from '../Dashboard/Summary/Summary';
import Totals from '../Dashboard/Totals/Totals';
import Login from '../Login/Login';
import Spinner from '../UI/Spinner/Spinner';
import * as actions from '../../store/actions';

class Demo extends Component {
  componentWillMount() {
    this.props.demoInit();
  }
  render() {
    let dashboard;
    if (this.props.demo.error) {
      dashboard = <Login error={this.demo.props.error} />;
    } else if (this.props.demo.demoLoading) {
      dashboard = <Spinner />;
    } else {
      dashboard = (
        <Aux>
          <Summary athlete={this.props.demo.athlete} totals={this.props.demo.totals} />
          <Totals totals={this.props.demo.totals} />
        </Aux>
      );
    }
    const calendar = this.props.demo.activities
      ? <Calendar activities={this.props.demo.activities} />
      : null;
    return (
      <Aux>
        {dashboard}
        {calendar}
      </Aux>
    );
  }
}

Demo.propTypes = {
  // demo reducer
  demo: PropTypes.shape({
    accessToken: PropTypes.string,
    activities: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    athlete: PropTypes.shape({}),
    totals: PropTypes.shape({}),
    error: PropTypes.shape({}),
    demoLoading: PropTypes.bool.isRequired,
  }).isRequired,
  // demo actions
  demoInit: PropTypes.func.isRequired,
};

export default connect(({ demo }) => ({ demo }), actions)(Demo);
