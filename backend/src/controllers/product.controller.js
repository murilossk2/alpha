const Product = require('../models/product.model');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

exports.create = async (req, res) => {
    try {
        const product = new Product(req.body);
        
        // Process images if they exist
        if (req.files && req.files.length > 0) {
            product.images = await Promise.all(req.files.map(async (file) => {
                const filename = `${Date.now()}-${file.originalname}`;
                const thumbnailFilename = `thumb-${filename}`;
                
                // Save original image
                await sharp(file.buffer)
                    .jpeg({ quality: 90 })
                    .toFile(path.join(__dirname, '../../uploads', filename));
                
                // Create and save thumbnail
                await sharp(file.buffer)
                    .resize(300, 300, { fit: 'cover' })
                    .jpeg({ quality: 70 })
                    .toFile(path.join(__dirname, '../../uploads', thumbnailFilename));
                
                return {
                    url: `/uploads/${filename}`,
                    thumbnail: `/uploads/${thumbnailFilename}`,
                    alt: req.body.name
                };
            }));
        }
        
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search };
        }

        const products = await Product.find(query)
            .populate('category')
            .populate('promotion')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('promotion');
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Process new images if they exist
        if (req.files && req.files.length > 0) {
            const newImages = await Promise.all(req.files.map(async (file) => {
                const filename = `${Date.now()}-${file.originalname}`;
                const thumbnailFilename = `thumb-${filename}`;
                
                await sharp(file.buffer)
                    .jpeg({ quality: 90 })
                    .toFile(path.join(__dirname, '../../uploads', filename));
                
                await sharp(file.buffer)
                    .resize(300, 300, { fit: 'cover' })
                    .jpeg({ quality: 70 })
                    .toFile(path.join(__dirname, '../../uploads', thumbnailFilename));
                
                return {
                    url: `/uploads/${filename}`,
                    thumbnail: `/uploads/${thumbnailFilename}`,
                    alt: req.body.name || product.name
                };
            }));

            // Combine existing and new images
            product.images = [...product.images, ...newImages];
        }

        // Update other fields
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Delete associated images
        if (product.images && product.images.length > 0) {
            await Promise.all(product.images.map(async (image) => {
                try {
                    await fs.unlink(path.join(__dirname, '../../', image.url));
                    await fs.unlink(path.join(__dirname, '../../', image.thumbnail));
                } catch (err) {
                    console.error('Erro ao deletar imagem:', err);
                }
            }));
        }

        await product.remove();
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.search = async (req, res) => {
    try {
        const { q, category, tags } = req.query;
        const query = {};

        if (q) {
            query.$text = { $search: q };
        }

        if (category) {
            query.category = category;
        }

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        const products = await Product.find(query)
            .populate('category')
            .populate('promotion')
            .limit(20)
            .exec();

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
