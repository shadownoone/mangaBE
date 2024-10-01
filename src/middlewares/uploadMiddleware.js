const multer = require('multer');
const { storage, imageFilter, fileStorage } = require('~/helpers/upload');

let uploadMd = multer({
    storage: storage,
    fileFilter: imageFilter,
});

const upload = (field) => (req, res, next) => {
    uploadMd.single(field)(req, res, async (err) => {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return res.json({ code: 1, message: req.fileValidationError });
        } else if (!req.file) {
            return res.json({ code: 1, message: 'Please select an file to upload' });
        } else if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }

        delete req.body.id;
        if (field === 'image') {
            req.body.image = 'http://localhost:5000/images/' + req.file.filename;
        } else {
            req.body.video = 'http://localhost:5000/videos/' + req.file.filename;
        }
        next();
    });
};

const uploads = multer({
    storage: fileStorage,
});

module.exports = { upload, uploads };
