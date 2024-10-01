const router = require("express").Router();

const HistoriesController = require("~/controllers/HistoriesController");

// [GET] /History
router.get("/", HistoriesController.get);

// [POST] /History
router.post("/", HistoriesController.create);

// [PUT] /History/:id
router.put("/:id", HistoriesController.update);

// [DELETE] /History/:id
router.delete("/:id", HistoriesController.delete);

module.exports = router;
