const commentsService = require('../services/commentsService');
const db = require('~/models');
const BaseController = require('./BaseController');

class CommentsController extends BaseController {
    constructor() {
        super('comments');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        try {
            const data = await commentsService.find({
                page: page,
                pageSize: pageSize,
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['username'],
                    },
                    {
                        model: db.Manga,
                        as: 'manga',
                        attributes: ['title'],
                    },
                    {
                        model: db.Chapter,
                        as: 'chapter',
                        attributes: ['title'],
                    },
                ],
                raw: false,
            });

            if (data.code === -1) {
                return res.status(500).json(data);
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ code: -1, message: error.message });
        }
    };

    // GET Comments By Chapter
    getCommentByManga = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;

        try {
            const manga_id = req.params.manga_id;

            const data = await commentsService.find({
                page: page,
                pageSize: pageSize,
                findOne: false,
                where: {
                    manga_id: manga_id,
                },

                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['username', 'avatar'],
                    },
                    {
                        model: db.Manga,
                        as: 'manga',
                        attributes: ['title'],
                    },
                    {
                        model: db.Chapter,
                        as: 'chapter',
                        attributes: ['title'],
                    },
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
            });

            if (data.code === -1) {
                return res.status(500).json(data);
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ code: -1, message: error.message });
        }
    };

    //POST Comments
    create = async (req, res) => {
        try {
            const userId = req.user.user_id;
            const mangaId = req.body.manga_id;
            const chapterId = req.body.chapter_id || null;
            const content = req.body.content;
            console.log('userId:', userId, 'mangaId:', mangaId);

            // Kiểm tra xem nội dung bình luận có hợp lệ không
            if (!content || content.trim().length === 0) {
                return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
            }
            // Thêm Comment
            const newComment = await commentsService.create({
                user_id: userId,
                manga_id: mangaId,
                chapter_id: chapterId,
                content: content,
            });

            return res.status(201).json({
                message: 'Thêm Comment thành công!',
                favorite: newComment,
            });
        } catch (error) {
            console.error('Error adding to comments:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    //DELETE Comments
    delete = async (req, res) => {
        try {
            const commentId = req.body.commentId;

            await commentsService.delete({
                where: { comment_id: commentId },
            });

            return res.status(200).json({
                message: 'Đã xóa comment!',
            });
        } catch (error) {
            console.error('Lỗi khi xóa comments:', error);
            return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        }
    };
}

module.exports = new CommentsController();
