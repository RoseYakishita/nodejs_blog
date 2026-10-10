const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const productsController = require('../app/controllers/products.controller');

// ==========================================
// 1. STATIC & TRASH ROUTES (Ưu tiên cao nhất)
// ==========================================
router.get('/trash', productsController.trashProducts);
router.get('/create', productsController.create);

// ==========================================
// 2. CREATE & UPDATE ROUTES (Có xử lý File Upload)
// ==========================================
router.post('/store', upload.array('fileImages', 10), productsController.store);
router.get('/:id/edit', productsController.edit);
router.put('/:id', upload.array('fileImages', 10), productsController.update);

// ==========================================
// 3. ACTION ROUTES (Restore, Force Delete, Soft Delete)
// ==========================================
router.patch('/:id/restore', productsController.restore);
router.delete('/:id/force', productsController.forceDelete);
router.delete('/:id', productsController.delete);

// ==========================================
// 4. MAIN LIST ROUTE
// ==========================================
router.get('/', productsController.index);

// ==========================================
// 5. DYNAMIC SLUG ROUTE (BẮT BUỘC ĐẶT Ở CUỐI CÙNG)
// ==========================================
router.get('/:slug', productsController.show);

module.exports = router;
