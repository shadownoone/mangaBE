const router = require("express").Router();

const ChapterController = require("~/controllers/ChapterController");

// [GET] /Chapter
router.get("/", ChapterController.get);

// [POST] /Chapter
router.post("/", ChapterController.create);

// [PUT] /Chapter/:id
router.put("/:id", ChapterController.update);

// [DELETE] /Chapter/:id
router.delete("/:id", ChapterController.delete);

//GET /Chapter/:id
router.get("/:slug", ChapterController.getChapterBySlug);

module.exports = router;
