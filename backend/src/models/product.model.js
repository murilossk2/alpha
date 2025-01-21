const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        url: String,
        thumbnail: String,
        alt: String
    }],
    description: {
        type: String,
        required: true
    },
    price: {
        min: Number,
        max: Number,
        current: Number
    },
    tags: [{
        type: String,
        trim: true
    }],
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    seoMetadata: {
        title: String,
        description: String,
        keywords: [String]
    }
}, {
    timestamps: true
});

// Add text index for search functionality
productSchema.index({
    name: 'text',
    description: 'text',
    'tags': 'text'
});

module.exports = mongoose.model('Product', productSchema);
