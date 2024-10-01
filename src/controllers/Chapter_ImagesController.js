const Chapter_ImagesService = require('../services/chapter_ImagesService');
const db = require('~/models');
const BaseController = require('./BaseController');

class Chapter_ImagesController extends BaseController {
    constructor() {
        super('chapter_Images');
    }

    // GET API
    get = async (req, res) => {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        try {
            const data = await Chapter_ImagesService.find({
                page: page,
                pageSize: pageSize,
                include: {
                    model: db.Chapter,
                    as: 'chapter',
                    attributes: ['chapter_id', 'title'],
                },
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
}

module.exports = new Chapter_ImagesController();
