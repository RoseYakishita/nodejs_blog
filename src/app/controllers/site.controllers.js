// 1. Kiểm tra kĩ đường dẫn tới file Furniture.js
const Furniture = require('../models/Furniture');

class SiteController {
  async index(req, res) {
    try {
      // Log ra để debug chắc chắn Furniture đã là Mongoose Model
      // console.log(Furniture);

      const furniture = await Furniture.find({});

      // Nếu dùng API:
      return res.json(furniture);

      // Nếu dùng Handlebars/Views để render giao diện:
      // return res.render('home', { furniture });
    } catch (err) {
      console.error('Lỗi DB:', err);
      return res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
    }
  }

  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
