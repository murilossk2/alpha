const Category = require('../models/category.model');
const slugify = require('slugify');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

exports.create = async (req, res) => {
    try {
        const category = new Category({
            ...req.body,
            slug: slugify(req.body.name, { lower: true })
        });

        // Process image if it exists
        if (req.file) {
            const filename = `category-${Date.now()}-${req.file.originalname}`;
            
            await sharp(req.file.buffer)
                .resize(800, 800, { fit: 'inside' })
                .jpeg({ quality: 90 })
                .toFile(path.join(__dirname, '../../uploads', filename));

            category.image = {
                url: `/uploads/${filename}`,
                alt: req.body.name
            };
        }

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('parent')
            .sort('order');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent');
        
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        // Update slug if name is changed
        if (req.body.name && req.body.name !== category.name) {
            req.body.slug = slugify(req.body.name, { lower: true });
        }

        // Process new image if it exists
        if (req.file) {
            // Delete old image if exists
            if (category.image && category.image.url) {
                try {
                    await fs.unlink(path.join(__dirname, '../../', category.image.url));
                } catch (err) {
                    console.error('Erro ao deletar imagem antiga:', err);
                }
            }

            const filename = `category-${Date.now()}-${req.file.originalname}`;
            
            await sharp(req.file.buffer)
                .resize(800, 800, { fit: 'inside' })
                .jpeg({ quality: 90 })
                .toFile(path.join(__dirname, '../../uploads', filename));

            req.body.image = {
                url: `/uploads/${filename}`,
                alt: req.body.name || category.name
            };
        }

        Object.assign(category, req.body);
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        // Delete associated image
        if (category.image && category.image.url) {
            try {
                await fs.unlink(path.join(__dirname, '../../', category.image.url));
            } catch (err) {
                console.error('Erro ao deletar imagem:', err);
            }
        }

        await category.remove();
        res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
            .populate('parent');
        
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
