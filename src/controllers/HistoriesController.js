const historiesService = require('../services/historiesService');
const db = require('~/models');
const BaseController = require('./BaseController');

class HistoriesController extends BaseController {
    constructor() {
        super('histories');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        try {
            const data = await historiesService.find({
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

    update = async (req, res) => {
        const userId = req.user.user_id;
        const mangaId = req.body.manga_id;
        const chapterId = req.body.chapter_id;

        try {
            // Kiểm tra xem lịch sử đã tồn tại cho manga và chapter này chưa
            const historiesResponse = await historiesService.find({
                where: {
                    user_id: userId,
                    manga_id: mangaId, // Chỉ tìm lịch sử đọc của manga này
                },
                findOne: true, // Tìm lịch sử của một chapter cụ thể
            });

            if (historiesResponse && historiesResponse.code === 0 && historiesResponse.data) {
                // Nếu có lịch sử cho chapter hiện tại, cập nhật
                const history = historiesResponse.data; // lấy bản ghi lịch sử

                // Cập nhật thuộc tính last_read_at và chapter_id
                history.chapter_id = chapterId;
                history.last_read_at = new Date();

                // Gọi phương thức update để lưu thay đổi
                await historiesService.update({
                    where: {
                        user_id: userId,
                        manga_id: mangaId,
                    },
                    data: history,
                });

                console.log('History updated successfully');
            } else {
                // Nếu chưa có lịch sử, tạo mới

                await historiesService.create({
                    user_id: userId,
                    manga_id: mangaId,
                    chapter_id: chapterId,
                    last_read_at: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            res.status(200).json({ message: 'Lịch sử đọc đã được cập nhật' });
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra', error });
        }
    };
}

module.exports = new HistoriesController();
