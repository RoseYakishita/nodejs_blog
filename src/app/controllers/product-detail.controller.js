// 1. Kiểm tra kĩ đường dẫn tới file Furniture.js
const Furniture = require('../models/Furniture');

class ProductDetailController {
  show(req, res) {
    Furniture.findOne({ slug: req.params.slug })
      .then((furniture) => {
        if (!furniture) {
          return res.status(404).send('Furniture not found');
        }
        res.render('product-detail', { furniture: furniture.toObject() });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  }
}

module.exports = new ProductDetailController();
