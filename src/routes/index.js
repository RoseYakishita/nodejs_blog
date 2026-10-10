const aboutRoute = require('./about.route');
const siteRoute = require('./site');
const productDetailRoute = require('./product-detail.route');
const productsRoute = require('./products.route');
function route(app) {
  app.use('/about', aboutRoute);
  app.use('/', siteRoute);
  app.use('/product-detail/', productDetailRoute);
  app.use('/products', productsRoute);
}
module.exports = route;
