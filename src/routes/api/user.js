const router = require('express').Router();

const userController = require('~/controllers/UserController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

// router.all('*', authenticateUser);

// [GET] /users
router.get('/all', userController.get);

router.get('/last-read', authenticateUser, userController.getLastReadMangaAndChapter);

router.get('/favorites', authenticateUser, userController.getFavoriteManga);

// [POST] /users
router.post('/', userController.create);

// [PUT] /users
router.put('/update', authenticateUser, userController.update);

// [DELETE] /users/:id
router.delete('/:id', userController.delete);

module.exports = router;
