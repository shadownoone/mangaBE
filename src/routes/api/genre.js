const router = require('express').Router();

const GenreController = require('~/controllers/GenreController');

// [GET] /Genre
router.get('/all', GenreController.get);

router.get('/:genreName', GenreController.getMangaByGenre);

// [POST] /Genre
router.post('/add', GenreController.createGenre);

// [PUT] /Genre/:id
router.put('/:id', GenreController.update);

// [DELETE] /Genre/:id
router.delete('/:id', GenreController.delete);

module.exports = router;
