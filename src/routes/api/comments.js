const router = require('express').Router();

const CommentsController = require('~/controllers/CommentsController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

// [GET] /Comments
router.get('/all', CommentsController.get);

// [GET] /CommentsByChapter
router.get('/:manga_id', CommentsController.getCommentByManga);

// [POST] /Comments
router.post('/create', authenticateUser, CommentsController.create);

// [PUT] /Comments/:id
router.put('/:id', CommentsController.update);

// [DELETE] /Comments/:id
router.delete('/delete', authenticateUser, CommentsController.delete);

module.exports = router;
