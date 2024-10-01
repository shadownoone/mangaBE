const manga_GenresService = require('../services/manga_GenresService');
const Genre = require('../services/genreService');
const Manga = require('../services/mangaService');
const db = require('~/models');
const BaseController = require('./BaseController');

class Manga_GenresController extends BaseController {
    constructor() {
        super('manga_Genres');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        try {
            const data = await manga_GenresService.find({
                page: page,
                pageSize: pageSize,
                include: [
                    {
                        model: db.Manga,
                        as: 'manga',
                        include: [
                            {
                                model: db.Chapter,
                                as: 'chapters',
                                attributes: ['chapter_id', 'title', 'createdAt'], // Lấy các thuộc tính cần thiết của chương
                                order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo để lấy chương mới nhất
                                limit: 1, // Chỉ lấy chương cuối cùng
                            },
                        ],
                    },

                    {
                        model: db.Genre,
                        as: 'genre',
                        attributes: ['name'], // Lấy ra tên thể loại
                    },
                ],
                raw: false, // raw: false để có thể lấy đối tượng liên quan (chapter)
            });

            if (data.code === -1) {
                return res.status(500).json(data);
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ code: -1, message: error.message });
        }
    };

    // API lấy truyện theo tên thể loại
    getMangaByGenre = async (req, res) => {
        const genreName = req.params.genreName;
        try {
            // Tìm thể loại dựa trên tên
            const genre = await db.Genre.findOne({
                where: { name: genreName },
            });

            if (!genre) {
                return res.status(404).json({ message: 'Thể loại không tồn tại' });
            }

            // Tìm truyện thuộc thể loại này
            const mangas = await db.Manga.findAll({
                include: [
                    {
                        model: db.Genre,
                        as: 'genres', // Đảm bảo alias chính xác
                        where: { genre_id: genre.genre_id },
                        through: { attributes: [] }, // Bỏ qua các thuộc tính từ bảng liên kết
                    },
                    {
                        model: db.Chapter,
                        as: 'chapters',
                        attributes: ['chapter_id', 'title', 'createdAt'], // Lấy các thuộc tính cần thiết của chương
                        order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo để lấy chương mới nhất
                        limit: 1, // Chỉ lấy chương cuối cùng
                    },
                ],
                attributes: ['manga_id', 'title', 'description', 'author', 'views', 'cover_image'],
            });

            // Trả về danh sách truyện thuộc thể loại
            return res.status(200).json({
                success: true,
                data: mangas,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy truyện theo thể loại',
                error: error.message,
            });
        }
    };
}

module.exports = new Manga_GenresController();
