const mangaService = require('../services/mangaService');
const db = require('~/models');
const { Op } = require('sequelize');
const BaseController = require('./BaseController');
const slugify = require('slugify');
const { removeVietnameseTones } = require('../utils/slug');

const ratingService = require('../services/ratingsService');

class MangaController extends BaseController {
    constructor() {
        super('manga');
    }

    //POST Manga
    // POST Manga
    create = async (req, res) => {
        try {
            // Lấy dữ liệu từ request body
            const { title, description, author, cover_image, status, is_vip, genres } = req.body;

            // Kiểm tra xem title đã được cung cấp chưa
            if (!title) {
                return res.status(400).json({ message: 'Title is required' });
            }

            // Tạo slug từ title
            const slug = slugify(title, {
                lower: true, // Chuyển sang chữ thường
                strict: true, // Loại bỏ ký tự đặc biệt
            });

            // Kiểm tra xem slug đã tồn tại hay chưa
            const existingManga = await db.Manga.findOne({ where: { slug } });
            if (existingManga) {
                return res.status(400).json({ message: 'Manga with this title already exists' });
            }

            // Tạo bản ghi Manga mới
            const newManga = await db.Manga.create({
                title,
                description,
                author: author || 'Unknown', // Nếu không có author thì set mặc định là Unknown
                cover_image: cover_image || '', // Nếu không có ảnh bìa thì để trống
                status: status || 0, // Mặc định là đang cập nhật (status = 0)
                is_vip: is_vip || false, // Mặc định là không VIP
                slug,
                createdAt: new Date(),
                updatedAt: new Date(),
                views: 0, // Lượt xem ban đầu là 0
                followers: 0, // Người theo dõi ban đầu là 0
            });

            // Xử lý genres nếu có trong request
            if (genres && Array.isArray(genres)) {
                for (const genreName of genres) {
                    // Tìm genre trong bảng Genre
                    let genre = await db.Genre.findOne({ where: { name: genreName } });

                    // Nếu genre không tồn tại, tạo mới
                    if (!genre) {
                        genre = await db.Genre.create({ name: genreName });
                    }

                    // Thêm thể loại vào bảng Manga_Genres
                    await db.Manga_Genres.create({
                        manga_id: newManga.manga_id,
                        genre_id: genre.genre_id,
                    });
                }
            }

            // Trả về kết quả
            return res.status(201).json({
                message: 'Manga created successfully',
                data: newManga,
            });
        } catch (error) {
            console.error('Error creating manga:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    //PUT Manga
    //PUT Manga
    update = async (req, res) => {
        const { id } = req.params; // Lấy id từ params
        const { title, description, author, cover_image, status, is_vip, genres } = req.body; // Lấy thông tin cập nhật từ body

        try {
            // Kiểm tra nếu Manga có tồn tại hay không
            const manga = await db.Manga.findByPk(id);
            if (!manga) {
                return res.status(404).json({ message: 'Manga not found' });
            }

            // Nếu có cập nhật title thì tạo slug mới từ title
            let newSlug = manga.slug; // Giữ nguyên slug nếu không cập nhật title
            if (title && title !== manga.title) {
                const normalizedTitle = removeVietnameseTones(title); // Chuẩn hóa title bằng cách loại bỏ dấu
                newSlug = slugify(normalizedTitle, {
                    lower: true, // Chuyển sang chữ thường
                    strict: true, // Loại bỏ ký tự đặc biệt
                });
                console.log('New slug:', newSlug);
            }

            // Kiểm tra và chuyển đổi status và is_vip về số (integer)
            const updatedStatus = status !== undefined ? parseInt(status, 10) : manga.status;
            const updatedIsVip = is_vip !== undefined ? (is_vip ? 1 : 0) : manga.is_vip;

            // Cập nhật thông tin Manga
            const updatedManga = await manga.update({
                title: title || manga.title,
                description: description || manga.description,
                author: author || manga.author,
                cover_image: cover_image || manga.cover_image,
                status: updatedStatus,
                is_vip: updatedIsVip,
                slug: newSlug,
                updatedAt: new Date(),
            });

            // Cập nhật các thể loại của Manga
            if (genres && Array.isArray(genres)) {
                // Xóa các thể loại hiện tại của manga từ bảng manga_genres
                await db.Manga_Genres.destroy({ where: { manga_id: id } });

                // Thêm các thể loại mới vào bảng manga_genres
                for (const genreName of genres) {
                    const genre = await db.Genre.findOne({ where: { name: genreName } });
                    if (genre) {
                        await db.Manga_Genres.create({
                            manga_id: id,
                            genre_id: genre.genre_id,
                        });
                    }
                }
            }

            return res.status(200).json({
                message: 'Manga updated successfully',
                data: updatedManga,
            });
        } catch (error) {
            console.error('Error updating manga:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 50;
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
    getVipManga = async (req, res) => {
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

    //ThongKe
    getStatistical = async (req, res) => {
        try {
            // Truy vấn tổng số lượt xem từ cột `views` trong bảng `Manga`
            const totalViews = await db.Manga.sum('views');
            const totalMangas = await db.Manga.count('manga_id');

            // Trả về kết quả dưới dạng JSON
            return res.status(200).json({
                code: 0,
                message: 'Success',
                data: {
                    totalViews, // Tổng lượt xem
                    totalMangas,
                },
            });
        } catch (error) {
            // Xử lý lỗi nếu có
            return res.status(500).json({
                code: -1,
                message: error.message,
            });
        }
    };

    //DELETE Manga
    delete = async (req, res) => {
        try {
            const manga_id = req.params.manga_id;
            console.log(manga_id);

            await mangaService.delete({
                where: { manga_id: manga_id },
            });

            return res.status(200).json({
                message: 'Đã xóa manga!',
            });
        } catch (error) {
            console.error('Lỗi khi xóa manga:', error);
            return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        }
    };

    getVipUsersWithPayments = async (req, res) => {
        const limit = req.query.limit || 20;

        try {
            const vipUsers = await db.User.findAll({
                where: {
                    is_vip: true, // Chỉ lấy người dùng VIP
                },
                include: [
                    {
                        model: db.Payments, // Kết hợp bảng Payments
                        as: 'payments', // Alias phải khớp với alias trong model
                        attributes: ['amount'], // Chỉ lấy số tiền
                    },
                ],
            });

            // Tính tổng số tiền và sắp xếp theo số tiền giảm dần
            const results = vipUsers
                .map((user) => {
                    const totalAmount = user.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
                    return {
                        user_id: user.user_id,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar,
                        vip_expiration: user.vip_expiration,
                        total_amount: totalAmount,
                    };
                })
                .sort((a, b) => b.total_amount - a.total_amount) // Sắp xếp giảm dần theo tổng tiền
                .slice(0, limit); // Lấy giới hạn số lượng người dùng

            return res.status(200).json({
                code: 0,
                data: results,
            });
        } catch (error) {
            console.error('Error fetching VIP users:', error);
            return res.status(500).json({
                code: -1,
                message: 'Lỗi khi lấy danh sách người dùng VIP',
            });
        }
    };
}

module.exports = new MangaController();
