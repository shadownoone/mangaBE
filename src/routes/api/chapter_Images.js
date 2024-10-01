const router = require("express").Router();

const Chapter_ImagesController = require("~/controllers/Chapter_ImagesController");

// [GET] /Chapter
router.get("/", Chapter_ImagesController.get);

// [POST] /Chapter
router.post("/", Chapter_ImagesController.create);

// [PUT] /Chapter/:id
router.put("/:id", Chapter_ImagesController.update);

// [DELETE] /Chapter/:id
router.delete("/:id", Chapter_ImagesController.delete);

module.exports = router;
