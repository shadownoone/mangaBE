const router = require("express").Router();

const Manga_GenresController = require("~/controllers/Manga_GenresController");

// [GET] /Manga
router.get("/all", Manga_GenresController.get);

// [GET] /Manga
router.get("/:genreName", Manga_GenresController.getMangaByGenre);

// [POST] /Manga
router.post("/", Manga_GenresController.create);

// [PUT] /Manga/:id
router.put("/:id", Manga_GenresController.update);

// [DELETE] /Manga/:id
router.delete("/:id", Manga_GenresController.delete);

module.exports = router;
