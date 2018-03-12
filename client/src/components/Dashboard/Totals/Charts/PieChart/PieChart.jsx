import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../../../store/actions';
import classes from './PieChart.scss';
import Circles from './Circles/Circles';

import { sports } from '../../Filters/filterTypes';

class PieChart extends Component {
  state = {
    value: null,
    units: null,
  }
  getCounts() {
    const { range, auth, demo } = this.props;
    const mode = !demo.demoLoading ? demo : auth; // check if in demo mode

    const activeCounts = {};
    sports.forEach((sport) => {
      const { key } = sport;
      if (this.props.filters[key]) {
        const { count } = mode.totals[`${range}_${key}_totals`];
        activeCounts[key] = count;
      }
    });
    return activeCounts;
  }
  handleMouseIn = (value, units) => {
    this.setState({
      value,
      units: `${units.substring(0, 1).toUpperCase()}${units.substring(1)}s`, // last minute formatting
    });
  }
  handleMouseOut = () => {
    this.setState({ value: null, units: null });
  }
  totalCount() {
    const activeCounts = this.getCounts();
    if (Object.keys(activeCounts).length > 0) {
      return Object.values(activeCounts).reduce((a, b) => a + b);
    }
    return null;
  }
  renderPiechart() {
    return (
      <svg viewBox="0 0 42 42" className={classes.donut}>
        <Circles
          data={this.getCounts()}
          mouseIn={this.handleMouseIn}
          mouseOut={this.handleMouseOut}
        />
        <g className={classes.chartText}>
          <text x="50%" y="50%" className={classes.chartNumber}>
            {this.state.value ? this.state.value : this.totalCount()}
          </text>
          <text x="50%" y="50%" className={classes.chartLabel}>
            {this.state.units ? this.state.units : 'Activities'}
          </text>
        </g>
      </svg>
    );
  }
  render() {
    return (
      <div className={classes.content}>
        {this.totalCount() > 0 ? this.renderPiechart() : null}
      </div>
    );
  }
}

PieChart.propTypes = {
  filters: PropTypes.shape({

  }),
};

export default connect(
  ({ auth, demo, filters }) => ({ auth, demo, filters }),
  actions,
)(PieChart);
