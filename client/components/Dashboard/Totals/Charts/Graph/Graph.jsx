import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../../../store/actions';
import classes from './Graph.scss';
import Bars from './Bars/Bars';

import { sports } from '../../Filters/filterTypes';

class Graph extends Component {
  state = {
    distance: null,
    time: null,
  }
  // builds an object of categorgy objects with key: sport and value: value
  getCategories() {
    const { range, auth, demo } = this.props;
    const mode = !demo.demoLoading ? demo : auth; // check if in demo mode

    const distances = {};
    const times = {};

    sports.forEach((sport) => {
      const { key } = sport;
      if (this.props.filters[key]) {
        /* eslint-disable camelcase */
        const { distance, moving_time } = mode.totals[`${range}_${sport.key}_totals`];
        distances[key] = distance * 0.000621371;
        times[key] = moving_time * 0.0166667;
        /* eslint-enable camelcase */
      }
    });

    return { distances, times };
  }
  // callback functions to respond to bar hover states
  handleMouseIn = (value, category) => {
    if (category === 'distance') {
      this.setState({
        distance: value,
      });
    } else if (category === 'time') {
      this.setState({
        time: value,
      });
    }
  }
  handleMouseOut = () => {
    this.setState({ distance: null, time: null });
  }
  render() {
    const categories = this.getCategories();
    const mobileTableRows = sports.map((sport) => {
      const { key } = sport;
      if (this.props.filters[key]) {
        return (
          <tr key={`${key}_table_row`}>
            <td>{`${key.substring(0, 1).toUpperCase()}${key.substring(1)}`}</td>
            <td>{`${(categories.distances[key]).toFixed(1)} mi`}</td>
            <td>{`${((categories.times[key]) / 60).toFixed(1)} hr`}</td>
          </tr>
        );
      }
      return null;
    });

    return (
      <div className={classes.content}>
        <div className={classes.category}>
          <Bars
            data={categories.distances}
            mouseIn={this.handleMouseIn}
            mouseOut={this.handleMouseOut}
            max={this.props.maximums.distance}
            category="distance"
          />
          <p className={classes.label}>
            {this.state.distance ? `${this.state.distance.toFixed(1)} mi` : 'Distance'}
          </p>
        </div>
        <div className={classes.category}>
          <Bars
            data={categories.times}
            mouseIn={this.handleMouseIn}
            mouseOut={this.handleMouseOut}
            max={this.props.maximums.time}
            category="time"
          />
          <p>
            {this.state.time ? `${(this.state.time / 60).toFixed(1)} hr` : 'Time'}
          </p>
        </div>
        <div className={classes.mobile}>
          <table>
            <tbody>
              <tr>
                <td>&nbsp;</td>
                <td>Distance</td>
                <td>Time</td>
              </tr>
              {mobileTableRows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Graph.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  demo: PropTypes.shape({}).isRequired,
  filters: PropTypes.shape({}).isRequired,
  maximums: PropTypes.shape({
    distance: PropTypes.number,
    time: PropTypes.number,
  }).isRequired,
  range: PropTypes.string.isRequired,
};

export default connect(({ auth, filters, demo }) => ({ auth, filters, demo }), actions)(Graph);
