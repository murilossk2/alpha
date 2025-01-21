const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 5000000 // 5MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Por favor, envie apenas imagens jpg, jpeg ou png'));
        }
        cb(null, true);
    },
    storage: multer.memoryStorage()
});

module.exports = upload;
