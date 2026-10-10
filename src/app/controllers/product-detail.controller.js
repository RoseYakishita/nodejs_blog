const Products = require('../models/Products');

class ProductDetailController {
  show(req, res) {
    const slug = req.params.slug;
    Products.findOne({ slug: slug })
      .lean()
      .then((product) => {
        if (!product) {
          return res.status(404).send('Product not found');
        }
        res.render('products/product-detail', { product: product });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
}

module.exports = new ProductDetailController();
