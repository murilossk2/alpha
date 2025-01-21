const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.get('/slug/:slug', categoryController.getBySlug);

// Protected routes
router.post('/', 
    authenticate, 
    authorize('admin', 'editor'), 
    upload.single('image'), 
    categoryController.create
);

router.put('/:id', 
    authenticate, 
    authorize('admin', 'editor'), 
    upload.single('image'), 
    categoryController.update
);

router.delete('/:id', 
    authenticate, 
    authorize('admin'), 
    categoryController.delete
);

module.exports = router;
