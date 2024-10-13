const router = require('express').Router();

const HistoriesController = require('~/controllers/HistoriesController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

// [GET] /History
router.get('/', HistoriesController.get);

// [POST] /History
router.post('/', HistoriesController.create);

// [POST] /histories/update
router.post('/update', authenticateUser, HistoriesController.update);

// [PUT] /History/:id
// router.put("/:id", HistoriesController.update);

// [DELETE] /History/:id
router.delete('/delete', authenticateUser, HistoriesController.delete);

module.exports = router;
