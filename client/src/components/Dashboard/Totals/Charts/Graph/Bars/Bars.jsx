import React from 'react';
import PropTypes from 'prop-types';
import Aux from '../../../../../hoc/Aux';

import classes from './Bars.scss';

const Bars = (props) => {
  const { data } = props;
  if (Object.keys(data).length < 1) return null;

  const entries = Object.entries(data);
  const categories = Object.keys(Object.values(data)[0]);

  // build an array of max values that correspond to category indexes
  const maximums = new Array(categories.length).fill(null);
  entries.forEach((entry) => {
    const barData = Object.entries(entry[1]);
    for (let i = 0; i < categories.length; i += 1) {
      maximums[i] = barData[i][1] > maximums[i] ? barData[i][1] : maximums[i];
    }
  });

  const barsByCategory = () => {
    const result = [];
    for (let i = 0; i < categories.length; i += 1) {
      entries.forEach((entry) => {
        const key = entry[0];
        const barData = Object.entries(entry[1]);
        // create bars scaled to the maximums array
        const percent = ((barData[i][1] / maximums[i]) * 100).toFixed(0);
        result.push(
          <div
            key={`${key}_bar_${Math.random()}`}
            className={[classes[`value-${percent}`], classes[key]].join(' ')}
          />,
        );
      });
    }
    return result;
  };

  const style = { gridTemplateColumns: `repeat(${barsByCategory().length}, 1fr)` };

  return (
    <div style={style} className={classes.graph}>
      {barsByCategory()}
    </div>
  );
};

export default Bars;
