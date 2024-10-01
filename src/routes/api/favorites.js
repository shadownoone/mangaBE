const router = require('express').Router();

const FavoritesController = require('~/controllers/FavoritesController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

// [GET] /Favorites
router.get('/', FavoritesController.get);

// [POST] /Favorites
// router.post("/", FavoritesController.create);

router.post('/add', authenticateUser, FavoritesController.addFavorite);

// [PUT] /Favorites/:id
router.put('/:id', FavoritesController.update);

// [DELETE]
router.delete('/remove', authenticateUser, FavoritesController.removeFavorite);

module.exports = router;
