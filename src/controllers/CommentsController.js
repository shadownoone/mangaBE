const commentsService = require("../services/commentsService");
const db = require("~/models");
const BaseController = require("./BaseController");

class CommentsController extends BaseController {
    constructor() {
        super("Comments");
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
                        as: "user",
                        attributes: ["username"],
                    },
                    {
                        model: db.Manga,
                        as: "manga",
                        attributes: ["title"],
                    },
                    {
                        model: db.Chapter,
                        as: "chapter",
                        attributes: ["title"],
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
}

module.exports = new CommentsController();
