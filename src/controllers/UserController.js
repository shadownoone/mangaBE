const userService = require('../services/userService');
const BaseController = require('./BaseController');
const db = require('~/models');

class UserController extends BaseController {
    constructor() {
        super('user');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 20;
        try {
            const data = await userService.find({
                page: page,
                pageSize: pageSize,
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

    getLastReadMangaAndChapter = async (req, res) => {
        const userId = req.user.user_id;

        try {
            const readingHistory = await userService.getReadingHistory(userId);

            if (!readingHistory || readingHistory.length === 0) {
                return res.status(404).json({ message: 'No reading history found' });
            }

            const historyData = readingHistory.map((entry) => ({
                historyId: entry.history_id,
                mangaTitle: entry.manga.title,
                chapterTitle: entry.chapter.title,
                chapterSlug: entry.chapter.slug,
                imageTitle: entry.manga.cover_image,
                slug: entry.manga.slug,
                chapterNumber: entry.chapter.chapter_number,
                last_read_at: entry.last_read_at,
            }));

            return res.status(200).json({
                code: 0,
                message: 'ok',
                data: {
                    user: {
                        user_id: readingHistory[0].user.user_id, // Thông tin user chung
                        username: readingHistory[0].user.username,
                        email: readingHistory[0].user.email,
                        avatar: readingHistory[0].user.avatar,
                        role: readingHistory[0].user.role,
                        createdAt: readingHistory[0].user.createdAt,
                        updatedAt: readingHistory[0].user.updatedAt,

                        // Danh sách các truyện và chương mà user đã đọc
                        readingHistory: historyData,
                    },
                },
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    getFavoriteManga = async (req, res) => {
        const userId = req.user.user_id;

        try {
            const favorites = await userService.getFavoritesByUser(userId);

            if (!favorites || favorites.length === 0) {
                return res.status(404).json({ message: 'No favorite manga found' });
            }

            // Extract user information from the first favorite (same for all entries)
            const user = favorites[0].user;

            return res.status(200).json({
                code: 0,
                message: 'ok',
                data: {
                    user: {
                        user_id: user.user_id,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar,
                        role: user.role,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        favorites: favorites.map((fav) => ({
                            favoriteId: fav.favorite_id,
                            mangaId: fav.manga.manga_id,
                            mangaTitle: fav.manga.title,
                            slug: fav.manga.slug,
                            coverImage: fav.manga.cover_image,
                            favoritedAt: fav.createdAt,
                        })),
                    },
                },
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // API
    // [POST] /users/create
    create = async (req, res) => {
        const data = await userService.create({ ...req.body, password: userService.hashPassword(req.body.password) });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };

    // [PUT] /users
    update = async (req, res) => {
        const userId = req.user.user_id; // Lấy userId từ token hoặc session
        const updateData = { ...req.body }; // Dữ liệu cần cập nhật

        try {
            // Gọi hàm update từ service với đúng cấu trúc
            const result = await userService.update({
                where: { user_id: userId }, // Điều kiện where để tìm user theo userId
                data: updateData, // Dữ liệu cần cập nhật
            });

            if (result.code === -1) {
                return res.status(500).json(result); // Lỗi server
            }

            res.json(result); // Trả về dữ liệu đã cập nhật thành công
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user.' });
        }
    };

    //getTotalUser
    totalUsers = async (req, res) => {
        try {
            const totalUsers = await db.User.count('user_id');
            return res.status(200).json({
                code: 0,
                message: 'Success',
                data: {
                    totalUsers,
                },
            });
        } catch (error) {
            return res.status(500).json({
                code: -1,
                message: error.message,
            });
        }
    };
}

module.exports = new UserController();
