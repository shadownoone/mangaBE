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
// router.post('/register', authController.register);
// router.get('/logout', authController.logout);
// router.get('/refresh-token', authController.refreshToken);
router.get('/current-user', authenticateUser, authController.getCurrentUser);
// router.patch('/update-profile', authenticateUser, upload.single('avatar'), authController.updateProfile);

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

// Thêm Facebook login routes
// router.get('/facebook', passport.authenticate('facebook'));

// router.get(
//     '/facebook/callback',
//     passport.authenticate('facebook', {
//         failureRedirect: '/login/failed',
//     }),
//     function (req, res) {
//         res.cookie('accessToken', req.user.accessToken, {
//             httpOnly: true,
//             maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
//         });
//         res.redirect(process.env.CLIENT_URL);
//     },
// );

// Route cho login thành công (tương tự như Google)
// router.get('/login/success', (req, res) => {
//     if (req.user) {
//         res.status(200).json({
//             error: false,
//             message: 'Successfully Logged In',
//             user: req.user,
//         });
//     } else {
//         res.status(403).json({ error: true, message: 'Not Authorized' });
//     }
// });

// Route cho login thất bại (tương tự như Google)
// router.get('/login/failed', (req, res) => {
//     res.status(401).json({
//         error: true,
//         message: 'Log in failure',
//     });
// });

module.exports = router;
