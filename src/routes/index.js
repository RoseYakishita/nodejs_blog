const aboutRoute = require('./about.route');
const siteRoute = require('./site');

function route(app) {
  app.use('/about', aboutRoute);
  app.use('/', siteRoute);
}
module.exports = route;
