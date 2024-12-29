const router = require('express').Router();

const MangaController = require('~/controllers/MangaController');

// [POST] /Manga
router.post('/create', MangaController.create);

// [PUT] /Manga/:id
router.put('/:id', MangaController.update);

// [GET] /Manga
router.get('/all', MangaController.get);

//Get Statistical
router.get('/statistical', MangaController.getStatistical);

router.get('/top', MangaController.getTopMangas);

// Route để tìm kiếm truyện theo từ khóa
router.get('/search', MangaController.searchManga);

//Get NewManga
router.get('/new-manga', MangaController.getNewManga);

router.get('/vip', MangaController.getVipUsersWithPayments);

//Get TopMangaByTime
router.get('/top-time', MangaController.getTopMangasByTime);

//Get VipManga
router.get('/vip-manga', MangaController.getVipManga);

// [GET] /slug/
router.get('/:slug', MangaController.getMangaBySlug);

// [GET] /slug/:slug_chapter
router.get('/:slug/:slug_chapter', MangaController.getMangaBySlugAndChapter);

// [DELETE] /Manga/:id
router.delete('/:manga_id', MangaController.delete);

module.exports = router;
