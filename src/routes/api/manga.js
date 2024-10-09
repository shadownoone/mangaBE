const router = require('express').Router();

const MangaController = require('~/controllers/MangaController');

// [GET] /Manga
router.get('/all', MangaController.get);

router.get('/top', MangaController.getTopMangas);

// Route để tìm kiếm truyện theo từ khóa
router.get('/search', MangaController.searchManga);

//Get NewManga
router.get('/new-manga', MangaController.getNewManga);

//Get TopMangaByTime
router.get('/top-time', MangaController.getTopMangasByTime);

// [GET] /id
// router.get('/:id', MangaController.getMangaById);

// [GET] /slug/
router.get('/:slug', MangaController.getMangaBySlug);

// [GET] /slug/:slug_chapter
router.get('/:slug/:slug_chapter', MangaController.getMangaBySlugAndChapter);

// [POST] /Manga
router.post('/', MangaController.create);

// [PUT] /Manga/:id
router.put('/:id', MangaController.update);

// [DELETE] /Manga/:id
router.delete('/:id', MangaController.delete);

module.exports = router;
