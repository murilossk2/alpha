const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
router.get('/', productController.getAll);
router.get('/search', productController.search);
router.get('/:id', productController.getOne);

// Protected routes
router.post('/', 
    authenticate, 
    authorize('admin', 'editor'), 
    upload.array('images', 5), 
    productController.create
);

router.put('/:id', 
    authenticate, 
    authorize('admin', 'editor'), 
    upload.array('images', 5), 
    productController.update
);

router.delete('/:id', 
    authenticate, 
    authorize('admin'), 
    productController.delete
);

module.exports = router;
