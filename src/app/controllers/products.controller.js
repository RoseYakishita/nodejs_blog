const Product = require('../models/Products');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ProductsController {
  // [GET] /products
  async index(req, res, next) {
    try {
      const { enabled, column, type } = res.locals._sort;

      let productQuery = Product.find({});

      if (enabled) {
        productQuery = productQuery.sort({
          [column]: type === 'asc' ? 1 : -1,
        });
      } else {
        productQuery = productQuery.sort({ createdAt: -1 });
      }

      const [products, deletedCount] = await Promise.all([
        productQuery.lean().exec(),
        Product.countDocumentsDeleted(),
      ]);

      res.render('products', {
        products,
        deletedCount,
      });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /products/create
  create(req, res) {
    res.render('products/create-product');
  }

  // [PUT] /products/:id/edit
  async edit(req, res, next) {
    Product.findById(req.params.id)
      .lean()
      .then((product) => res.render('products/edit-product', { product }))
      .catch((error) => next(error));
  }
  // [PUT] /products/:id - Cập nhật sản phẩm
  async update(req, res, next) {
    try {
      const {
        name,
        price,
        originalPrice,
        stock,
        status,
        description,
        urlImages,
      } = req.body;

      let finalImages = [];

      // 1. Xử lý ảnh mới tải lên qua Multer & Sharp
      if (req.files && req.files.length > 0) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPromises = req.files.map(async (file) => {
          const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
          const outputPath = path.join(uploadDir, filename);

          await sharp(file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .toFormat('webp', { quality: 80 })
            .toFile(outputPath);

          return `/uploads/${filename}`;
        });

        const processedImages = await Promise.all(uploadPromises);
        finalImages.push(...processedImages);
      }

      // 2. Xử lý các link URL ảnh
      if (urlImages) {
        const urlList = Array.isArray(urlImages) ? urlImages : [urlImages];
        const validUrls = urlList
          .map((url) => url.trim())
          .filter((url) => url.length > 0);
        finalImages.push(...validUrls);
      }

      // 3. Chuẩn bị dữ liệu cập nhật
      const updateData = {
        name,
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        stock: Number(stock) || 0,
        status: status || 'active',
        description,
      };

      // Chỉ cập nhật danh sách ảnh nếu người dùng có nhập/tải ảnh mới
      if (finalImages.length > 0) {
        updateData.images = finalImages;
      }

      await Product.updateOne({ _id: req.params.id }, updateData);

      res.redirect('/products');
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /products/:id
  async delete(req, res, next) {
    try {
      await Product.delete({
        _id: req.params.id,
      });

      res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /products/:slug
  async show(req, res, next) {
    try {
      const product = await Product.findOne({ slug: req.params.slug }).lean();

      if (!product) {
        return res
          .status(404)
          .render('404', { message: 'Không tìm thấy sản phẩm' });
      }

      // Render view chi tiết sản phẩm
      res.render('products/product-detail', { product });
    } catch (error) {
      next(error);
    }
  }

  // [POST] /products/store
  async store(req, res, next) {
    try {
      const {
        _id,
        name,
        price,
        originalPrice,
        stock,
        status,
        description,
        variants,
      } = req.body;

      let finalImages = [];

      // 1. Nén ảnh bằng Sharp
      if (req.files && req.files.length > 0) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPromises = req.files.map(async (file) => {
          const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
          const outputPath = path.join(uploadDir, filename);

          await sharp(file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .toFormat('webp', { quality: 80 })
            .toFile(outputPath);

          return `/uploads/${filename}`;
        });

        const processedImages = await Promise.all(uploadPromises);
        finalImages.push(...processedImages);
      }

      // 2. Link URL
      if (req.body.urlImages) {
        const urlList = Array.isArray(req.body.urlImages)
          ? req.body.urlImages
          : [req.body.urlImages];
        const validUrls = urlList
          .map((url) => url.trim())
          .filter((url) => url.length > 0);
        finalImages.push(...validUrls);
      }

      // 3. Biến thể
      let processedVariants = [];
      if (variants) {
        const rawVariants = Array.isArray(variants)
          ? variants
          : Object.values(variants);
        processedVariants = rawVariants.filter((v) => v.size || v.color);
      }

      // 4. Lưu sản phẩm
      const productData = {
        _id,
        name,
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        stock: Number(stock) || 0,
        status: status || 'active',
        description,
        images: finalImages.length > 0 ? finalImages : undefined,
        variants: processedVariants,
      };

      const product = new Product(productData);
      await product.save();

      res.redirect('/products');
    } catch (error) {
      next(error);
    }
  }

  // [GET] /trash/products
  async trashProducts(req, res, next) {
    try {
      const products = await Product.findDeleted({}).lean();
      res.render('products/trash-products', { products });
    } catch (error) {
      next(error);
    }
  }

  // [PATCH] /products/:id/restore
  async restore(req, res, next) {
    try {
      await Product.restore({ _id: req.params.id });

      return res.status(200).json({
        success: true,
        message: 'Khôi phục sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /products/:id/force
  async forceDelete(req, res, next) {
    try {
      // Xóa hẳn khỏi database trong MongoDB
      await Product.deleteOne({ _id: req.params.id });

      return res.status(200).json({
        success: true,
        message: 'Đã xóa vĩnh viễn sản phẩm',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductsController();
