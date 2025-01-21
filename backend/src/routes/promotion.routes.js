const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', promotionController.getAll);
router.get('/active', promotionController.getActive);
router.get('/:id', promotionController.getOne);

// Protected routes
router.post('/', 
    authenticate, 
    authorize('admin', 'editor'), 
    promotionController.create
);

router.put('/:id', 
    authenticate, 
    authorize('admin', 'editor'), 
    promotionController.update
);

router.delete('/:id', 
    authenticate, 
    authorize('admin'), 
    promotionController.delete
);

module.exports = router;
