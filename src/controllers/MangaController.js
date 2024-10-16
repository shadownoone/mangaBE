const mangaService = require('../services/mangaService');
const db = require('~/models');
const { Op } = require('sequelize');
const BaseController = require('./BaseController');

const ratingService = require('../services/ratingsService');

class MangaController extends BaseController {
    constructor() {
        super('manga');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 20;
        try {
            const data = await mangaService.find({
                page: page,
                pageSize: pageSize,
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        limit: 1,
                        order: [['chapter_number', 'DESC']],
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: db.Ratings,
                        as: 'ratings',
                    },
                ],
                raw: false,
            });

            if (data.code === -1) {
                return res.status(500).json(data);
            }

            // Tạo danh sách manga với điểm trung bình
            const mangasWithRatings = await Promise.all(
                data.data.data.map(async (manga) => {
                    const averageRating = await ratingService.getAverageRating(manga.manga_id);

                    // Trả về cấu trúc dữ liệu của manga cùng với averageRating
                    return {
                        ...manga.dataValues, // Sử dụng dataValues để giữ nguyên tất cả các thuộc tính
                        averageRating, // thêm điểm trung bình
                    };
                }),
            );

            // Trả về dữ liệu với meta và danh sách manga đã tính trung bình
            return res.status(200).json({
                code: 0,
                message: 'ok',
                data: {
                    meta: data.data.meta,
                    data: mangasWithRatings, // Cập nhật danh sách manga
                },
            });
        } catch (error) {
            return res.status(500).json({ code: -1, message: error.message });
        }
    };

    // GET /id API
    //     getMangaById = async (req, res) => {
    //         try {
    //             const id = req.params.id;
    //
    //             const data = await mangaService.find({
    //                 findOne: true,
    //                 where: {
    //                     manga_id: id,
    //                 },
    //                 include: [
    //                     {
    //                         model: db.Chapter,
    //                         as: 'chapters',
    //                     },
    //                     {
    //                         model: db.Genre,
    //                         as: 'genres',
    //                         attributes: ['name'],
    //                         through: {
    //                             attributes: [],
    //                         },
    //                     },
    //
    //                     {
    //                         model: db.Ratings,
    //                         as: 'ratings',
    //                     },
    //                 ],
    //                 raw: false,
    //             });
    //
    //             if (!data) {
    //                 return res.status(404).json({ message: 'Manga not found' });
    //             }
    //
    //             return res.status(200).json(data);
    //         } catch (error) {
    //             console.error('Error in getMangaById:', error); // Log toàn bộ lỗi
    //             return res.status(500).json({
    //                 message: 'Internal server error',
    //                 error: error.message, // Trả lại lỗi chi tiết hơn
    //             });
    //         }
    //     };

    //GET /slug

    getMangaBySlug = async (req, res) => {
        try {
            const slug = req.params.slug;

            const data = await mangaService.find({
                findOne: true,
                where: {
                    slug: slug,
                },
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'],
                        through: {
                            attributes: [],
                        },
                    },

                    {
                        model: db.Ratings,
                        as: 'ratings',
                    },
                ],
                raw: false,
            });

            if (data.code === -1) {
                return res.status(500).json(data);
            }
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // [GET] /slug/:slug_chapter
    getMangaBySlugAndChapter = async (req, res) => {
        try {
            const { slug, slug_chapter } = req.params;

            const data = await mangaService.find({
                findOne: true,
                where: {
                    slug: slug,
                },
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        attributes: ['chapter_id', 'title', 'slug', 'createdAt'],
                        include: [
                            {
                                model: db.Chapter_Images,
                                as: 'images',
                                attributes: ['image_id', 'image_url', 'image_order'],
                                order: [['image_order', 'ASC']],
                            },
                        ],
                    },
                ],
                raw: false,
            });

            if (!data) {
                return res.status(404).json({ message: 'Manga not found' });
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // GET /top API
    getTopMangas = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 20;

        try {
            // Lấy danh sách top manga, sắp xếp theo lượt xem (views) giảm dần
            const data = await mangaService.find({
                page: page,
                pageSize: pageSize,
                order: [['views', 'DESC']],
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        limit: 1, // Lấy một chương
                        order: [['chapter_number', 'DESC']],
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'],
                        through: {
                            attributes: [],
                        },
                    },
                ],
                raw: false,
            });

            // Kiểm tra nếu không có dữ liệu trả về
            if (!data || data.code === -1) {
                return res.status(500).json({ code: -1, message: 'Không có dữ liệu manga hàng đầu' });
            }

            // Trả về dữ liệu manga top
            return res.status(200).json({ code: 0, message: 'Lấy danh sách manga hàng đầu thành công', data });
        } catch (error) {
            // Xử lý lỗi và trả về phản hồi lỗi
            console.error('Lỗi khi lấy danh sách manga hàng đầu:', error);
            return res.status(500).json({ code: -1, message: error.message });
        }
    };

    // API tìm kiếm truyện theo từ khóa
    searchManga = async (req, res) => {
        const { q } = req.query; // Lấy từ khóa tìm kiếm từ query params
        if (!q) {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        try {
            const mangas = await db.Manga.findAll({
                where: {
                    // Tìm kiếm theo tiêu đề hoặc mô tả truyện có chứa từ khóa
                    [Op.or]: [{ title: { [Op.like]: `%${q}%` } }],
                },
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        limit: 1, // Lấy chương mới nhất
                        order: [['chapter_number', 'DESC']],
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'], // Lấy tên thể loại
                        through: { attributes: [] }, // Bỏ qua các thuộc tính của bảng liên kết
                    },
                ],
            });

            if (mangas.length === 0) {
                return res.status(404).json({ message: 'No mangas found' });
            }

            return res.status(200).json({
                success: true,
                data: mangas,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error occurred during search',
                error: error.message,
            });
        }
    };

    // GET API lấy các truyện top theo ngày, tuần, tháng
    getTopMangasByTime = async (req, res) => {
        const { period } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;

        // Hàm tính toán ngày bắt đầu dựa trên "period"
        const getStartDate = (period) => {
            const now = new Date();
            switch (period) {
                case 'day':
                    return new Date(now.setDate(now.getDate() - 1)); // Top ngày
                case 'week':
                    return new Date(now.setDate(now.getDate() - 7)); // Top tuần
                case 'month':
                    return new Date(now.setMonth(now.getMonth() - 1)); // Top tháng
                default:
                    return null;
            }
        };

        const startDate = getStartDate(period);
        if (!startDate) {
            return res.status(400).json({
                code: -1,
                message: "Invalid period. Please use 'day', 'week', or 'month'.",
            });
        }

        try {
            // Lấy các truyện có lượt xem cao nhất trong khoảng thời gian
            const data = await mangaService.find({
                where: {
                    views: {
                        // Thay vì updatedAt, bạn lọc dựa trên số lượt xem
                        [Op.gte]: startDate, // Lọc truyện theo ngày cập nhật hoặc số lượt xem trong thời gian nhất định
                    },
                },
                order: [['views', 'DESC']], // Sắp xếp theo số lượt xem giảm dần
                limit: pageSize,
                offset: (page - 1) * pageSize,
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        limit: 1, // Lấy chương mới nhất
                        order: [['chapter_number', 'DESC']],
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'],
                        through: {
                            attributes: [],
                        },
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

    getNewManga = async (req, res) => {
        const limit = req.query.limit || 20;
        try {
            const newMangas = await db.Manga.findAll({
                limit: limit, // Giới hạn số lượng manga trả về
                order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        limit: 1, // Lấy chương mới nhất của từng manga
                        order: [['chapter_number', 'DESC']],
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'],
                        through: {
                            attributes: [], // Loại bỏ các thuộc tính dư thừa từ bảng nối
                        },
                    },
                ],

                raw: false,
            });

            return res.status(200).json({
                code: 0,
                data: newMangas,
            });
        } catch (error) {
            return res.status(500).json({
                code: -1,
                message: error.message,
            });
        }
    };

    //getVipManga
    ggetVipManga = async (req, res) => {
        const limit = req.query.limit || 20; // Giới hạn số lượng manga trả về
        try {
            const vipMangas = await db.Manga.findAll({
                where: {
                    is_vip: true, // Chỉ lấy những manga có is_vip là true
                },
                limit: limit, // Giới hạn số lượng manga trả về
                order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
                include: [
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        limit: 1, // Lấy chương mới nhất của từng manga
                        order: [['chapter_number', 'DESC']],
                    },
                    {
                        model: db.Genre,
                        as: 'genres',
                        attributes: ['name'],
                        through: {
                            attributes: [], // Loại bỏ các thuộc tính dư thừa từ bảng nối
                        },
                    },
                ],
                raw: false,
            });

            return res.status(200).json({
                code: 0,
                data: vipMangas,
            });
        } catch (error) {
            return res.status(500).json({
                code: -1,
                message: error.message,
            });
        }
    };
}

module.exports = new MangaController();
