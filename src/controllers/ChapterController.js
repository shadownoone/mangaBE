const chapterService = require('../services/chapterService');
const db = require('~/models');
const BaseController = require('./BaseController');

class ChapterController extends BaseController {
    constructor() {
        super('chapter');
    }

    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 50;
        try {
            const data = await chapterService.find({
                page: page,
                pageSize: pageSize,
                include: {
                    model: db.Manga,
                    as: 'manga',
                    attributes: ['manga_id', 'title'],
                },
                raw: false, // raw: false để có thể lấy đối tượng liên quan (manga)
            });

            if (data.code === -1) {
                return res.status(500).json(data);
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ code: -1, message: error.message });
        }
    };

    // [GET] /Chapter/:slug
    getChapterBySlug = async (req, res) => {
        const slug = req.params.slug;

        const data = await chapterService.find({
            findOne: true,
            where: {
                slug: slug,
            },
            include: [
                {
                    model: db.Chapter_Images,
                    as: 'images', // Đảm bảo "images" là tên alias bạn đã định nghĩa trong model Chapter
                    attributes: ['image_url', 'image_order'], // Lấy đúng thuộc tính
                },
            ],
            raw: false,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }
        return res.status(200).json(data);
    };
}

module.exports = new ChapterController();
