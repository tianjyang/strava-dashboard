import { DEMO_SUCCESS, DEMO_FAIL } from '../actions/types';
import updateObject from '../utility';

const initialState = {
  accessToken: null, // existing localStorage token is checked in componentWillMount
  activities: null,
  athlete: null,
  totals: null,
  error: null,
  demoLoading: true, // since oAuth is a redirect, set initial loading state to true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DEMO_SUCCESS:
      return updateObject(state, {
        accessToken: action.accessToken,
        activities: action.activities,
        athlete: action.athlete,
        totals: action.totals,
        error: null,
        demoLoading: false,
      });
    case DEMO_FAIL:
      return updateObject(state, {
        demoLoading: false,
        error: action.error,
      });
    default:
      return state;
  }
};

export default reducer;
