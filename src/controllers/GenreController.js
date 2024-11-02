const genreService = require('../services/genreService');
const db = require('~/models');
const BaseController = require('./BaseController');

class GenreController extends BaseController {
    constructor() {
        super('genre');
    }

    createGenre = async (req, res) => {
        const genreName = req.body.genreName; // Sử dụng req.body thay vì req.params nếu truyền qua Body

        try {
            // Kiểm tra xem genre đã tồn tại chưa
            let genre = await db.Genre.findOne({ where: { name: genreName } });
            if (!genre) {
                // Nếu chưa tồn tại, tạo genre mới
                genre = await db.Genre.create({ name: genreName });
            }

            // Trả về genre đã tồn tại hoặc vừa tạo
            res.status(201).json({ message: 'Genre checked/added', data: genre });
        } catch (error) {
            console.error('Error details:', error); // Ghi chi tiết lỗi vào console
            res.status(500).json({ message: 'Error checking/adding genre', error: error.message });
        }
    };

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 20;
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
                    'slug',
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
