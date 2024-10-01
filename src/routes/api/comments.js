const router = require("express").Router();

const CommentsController = require("~/controllers/CommentsController");

// [GET] /Comments
router.get("/", CommentsController.get);

// [POST] /Comments
router.post("/", CommentsController.create);

// [PUT] /Comments/:id
router.put("/:id", CommentsController.update);

// [DELETE] /Comments/:id
router.delete("/:id", CommentsController.delete);

module.exports = router;
