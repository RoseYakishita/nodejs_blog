const express = require('express');
const router = express.Router();
const productDetailController = require('../app/controllers/product-detail.controller');

router.get('/:slug', productDetailController.show);

module.exports = router;
