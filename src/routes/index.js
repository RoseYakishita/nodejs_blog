const aboutRoute = require('./about.route');
const siteRoute = require('./site');
const productDetailRoute = require('./product-detail');
function route(app) {
  app.use('/about', aboutRoute);
  app.use('/', siteRoute);
  app.use('/furniture', productDetailRoute);
}
module.exports = route;
