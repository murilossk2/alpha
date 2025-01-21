const Promotion = require('../models/promotion.model');
const Product = require('../models/product.model');

exports.create = async (req, res) => {
    try {
        const promotion = new Promotion(req.body);
        await promotion.save();

        // Update products with this promotion
        if (req.body.applicableProducts && req.body.applicableProducts.length > 0) {
            await Product.updateMany(
                { _id: { $in: req.body.applicableProducts } },
                { $set: { promotion: promotion._id } }
            );
        }

        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { active } = req.query;
        const query = {};

        if (active === 'true') {
            const now = new Date();
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
            query.isActive = true;
        }

        const promotions = await Promotion.find(query)
            .populate('applicableProducts')
            .populate('applicableCategories')
            .sort('-startDate');

        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
            .populate('applicableProducts')
            .populate('applicableCategories');
        
        if (!promotion) {
            return res.status(404).json({ message: 'Promoção não encontrada' });
        }
        
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        
        if (!promotion) {
            return res.status(404).json({ message: 'Promoção não encontrada' });
        }

        // Remove promotion from old products
        if (promotion.applicableProducts && promotion.applicableProducts.length > 0) {
            await Product.updateMany(
                { _id: { $in: promotion.applicableProducts } },
                { $unset: { promotion: "" } }
            );
        }

        Object.assign(promotion, req.body);
        await promotion.save();

        // Add promotion to new products
        if (req.body.applicableProducts && req.body.applicableProducts.length > 0) {
            await Product.updateMany(
                { _id: { $in: req.body.applicableProducts } },
                { $set: { promotion: promotion._id } }
            );
        }

        res.json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        
        if (!promotion) {
            return res.status(404).json({ message: 'Promoção não encontrada' });
        }

        // Remove promotion from products
        if (promotion.applicableProducts && promotion.applicableProducts.length > 0) {
            await Product.updateMany(
                { _id: { $in: promotion.applicableProducts } },
                { $unset: { promotion: "" } }
            );
        }

        await promotion.remove();
        res.json({ message: 'Promoção deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getActive = async (req, res) => {
    try {
        const now = new Date();
        const activePromotions = await Promotion.find({
            startDate: { $lte: now },
            endDate: { $gte: now },
            isActive: true
        })
        .populate('applicableProducts')
        .populate('applicableCategories');

        res.json(activePromotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
