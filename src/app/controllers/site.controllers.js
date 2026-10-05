// 1. Kiểm tra kĩ đường dẫn tới file Furniture.js
const Furniture = require('../models/Furniture');

class SiteController {
  async index(req, res, next) {
    try {
      const data = await Furniture.find({}).lean();
      res.render('Home', { furnitures: data });
    } catch (error) {
      next(error);
    }
    // res.render('Home');
  }

  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
