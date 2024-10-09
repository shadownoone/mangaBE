const genreService = require('../services/genreService');
const db = require('~/models');
const BaseController = require('./BaseController');

class GenreController extends BaseController {
    constructor() {
        super('genre');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        try {
            const data = await genreService.find({
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

            // Tìm các truyện thuộc thể loại này cùng với chương mới nhất của từng truyện
            const mangas = await db.Manga.findAll({
                include: [
                    {
                        model: db.Genre,
                        as: 'genres', // Alias của mô hình Genre
                        where: { genre_id: genre.genre_id },
                        through: { attributes: [] }, // Bỏ qua các thuộc tính từ bảng liên kết
                    },
                    {
                        model: db.Chapter,
                        as: 'chapters', // Alias của mô hình Chapter
                        limit: 1, // Lấy một chương
                        order: [['chapter_number', 'DESC']],
                    },
                ],
                attributes: [
                    'manga_id',
                    'title',
                    'description',
                    'author',
                    'views',
                    'cover_image',
                    'createdAt',
                    'updatedAt',
                ],
                raw: false,
            });

            // Trả về danh sách truyện cùng chương cuối cùng
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

module.exports = new GenreController();
