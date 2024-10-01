const router = require("express").Router();

const RatingController = require("~/controllers/RatingController");

// [GET] /Rating
router.get("/", RatingController.get);

// [POST] /Rating
router.post("/", RatingController.create);

// [PUT] /Rating/:id
router.put("/:id", RatingController.update);

// [DELETE] /Rating/:id
router.delete("/:id", RatingController.delete);

module.exports = router;
