const router = require('express').Router();
require('dotenv').config();
const passport = require('passport');
const multer = require('multer');
const authController = require('~/controllers/AuthController');
const { storage } = require('~/helpers/upload');
const { authenticateUser } = require('~/middlewares/authMiddleware');

let upload = multer({
    storage: storage,
});

router.post('/login', authController.login);

router.post('/signup', authController.register);

router.get('/logout', authController.logout);

router.get('/current-user', authenticateUser, authController.getCurrentUser);

// Thêm Google login routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login/failed',
    }),
    function (req, res) {
        res.cookie('accessToken', req.user.accessToken, {
            httpOnly: true,
            maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
        });
        res.redirect(process.env.CLIENT_URL);
    },
);

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: 'Successfully Logged In',
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: 'Not Authorized' });
    }
});

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    });
});

//Local
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { user_id: user.user_id, email: user.email });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = router;
