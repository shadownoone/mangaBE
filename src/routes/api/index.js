const router = require('express').Router();

const mangaRouter = require('./manga');

const chapterRouter = require('./chapter');

const chapterImgRouter = require('./chapter_Images');

const genreRouter = require('./genre');

const mangaGenreRouter = require('./manga_Genres');

const favoriteRouter = require('./favorites');

const commentRouter = require('./comments');

const historiesRouter = require('./histories');

const ratingRouter = require('./ratings');

const authRouter = require('./auth');

const registerRouter = require('./register');

const userRouter = require('./user');

const paymentRouter = require('./payments');

const registerController = require('~/controllers/RegisterController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.use('/payments', paymentRouter);

router.use('/mangas', mangaRouter);

router.use('/chapters', chapterRouter);

router.use('/chapterImg', chapterImgRouter);

router.use('/genres', genreRouter);

router.use('/mangaGenre', mangaGenreRouter);

router.use('/favorites', favoriteRouter);

router.use('/comments', commentRouter);

router.use('/histories', historiesRouter);

router.use('/ratings', ratingRouter);

router.use('/auth', authRouter);

router.use('/registers', registerRouter);

router.use('/users', userRouter);

// router.get('/analysis', registerController.analysis);

module.exports = router;
