const multer = require('multer');
const appRoot = require('app-root-path');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const imageFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb({ message: 'Unsupported File Format' }, false);
    }
};

const videoFilter = function (req, file, cb) {
    if (file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb({ message: 'Unsupported File Format' }, false);
    }
};

module.exports = { storage, fileStorage, imageFilter, videoFilter };
