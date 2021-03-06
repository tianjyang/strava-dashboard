## Strava Dash

A fitness dashboard built on the [Strava v3](https://developers.strava.com/docs/reference/) API and the MERN Stack.

## Notable Features

* [Server-side Authentication](https://github.com/connorjohnlind/strava-dashboard/blob/master/server/routes/authRoutes.js) - the Strava accessToken is exchanged on the back-end, returned to the client, and stored in localStorage for future requests, in order to keep the `STRAVA_CLIENT_SECRET` secure
* [Async/Await](https://github.com/connorjohnlind/strava-dashboard/blob/master/client/store/actions/auth.js) - avoiding callback hell for several asynchronous requests to the Strava API
* [Pie Charts and Bar Graphs](https://github.com/connorjohnlind/strava-dashboard/tree/master/client/components/Dashboard/Totals/Charts) - an animated and interactive analytics dashboard, made from a combination of Redux and Local UI State Components
* [/demo data](https://github.com/connorjohnlind/strava-dashboard/blob/master/server/scripts/demo.js) - a script is run on the backend to provide dummy data for visitors without a Strava account
* [Custom Webpack Config](https://github.com/connorjohnlind/strava-dashboard/blob/master/webpack.config.prod.js) - full-stack Webpack 4 configurations for development and production

## Notes on Development

#### Front-end

* The string-based data structure of the [getStats](https://developers.strava.com/docs/reference/#api-Athletes-getStats) API endpoint made a huge impact on the way data was passed around the app. Early on in development, I decided to leave the Strava API data 'as is' in Redux, and build more convenient data objects in containers (i.e. the `getChartMaximums()` method in `Totals`). If the getStats data would have been needed in other components, I might have decided to parse the data into a more desirable format in the action creator, building objects based on range (such as `recent.ride.count`) instead of dealing with template strings in `recent_ride_totals.count`).

* Utilizing a [config file](https://github.com/connorjohnlind/strava-dashboard/blob/master/client/components/Dashboard/Totals/Filters/filterTypes.js) for the sports, ranges, and their labels made for a lot more DRY iteration throughout the app. This might have been overkill, considering it's very unlikely that running, biking, swimming will ever change in the context of a triathlete-focused app. However I found it to be useful exercise to allow all of my components to adjust to this configuration (i.e. renaming 'Month' to '4 weeks' as a filter). There are just a few instances where I opted to hard code based on sport, such as the color coding of run/ride/swim in SCSS files.

* The app started with a mobile-first design, but desktop quickly became the focus of development.

#### Back-end

* A portfolio project targeted only towards power users of a specific app isn't a good demonstration for the general public. Therefore, I decided to save my personal Strava data to a MongoDB instance and serve that publicly from [/demo](https://stravadash.herokuapp.com/demo). There were a few other approaches that I considered, such calling the Strava API with my authentication credentials on Node, and serving that to /demo directly, yet if any accessTokens were revoked or expired the demo app would break. Therefore serving some static assets from Mongo seemed the best approach. You can view the script file [here](https://github.com/connorjohnlind/strava-dashboard/blob/master/server/scripts/demo.js), where I use Node's native Mongo driver to parse a local JS object (copy and pasted from my 'auth' reducer in redux dev tools). The data, properly formatted for the client side, is then added to a 'demo' reducer in the app upon GET /demo.

## Areas for Improvement

#### Front-end

* The `Demo` component hierarchy is a bit inconsistent in the way that Strava data is passed to components. For the `Calendar`, the demo data is passed in as a prop (`activities`), and the `Calendar` handles all component renders accordingly. The `Totals` component, however, is connected to Redux at nearly every step in the hierarchy (`Totals`, `PieChart`, `Graph`). The reason this decision was made was because of the difficulty with utilizing the string-based structure of getStats (mentioned above), which made passing in data as props a bit bloated. In my opinion, an optimal refactor would include rewriting the getStats response to a more convenient data structure in Redux, and passing along the key pieces of data (maximums, distance, and counts by sport and range) in as props throughout the `Totals` component hierarchy.
