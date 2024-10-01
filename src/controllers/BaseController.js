class BaseController {
    constructor(model) {
        this.model = model;
        this.baseService = require(`../services/${this.model}Service`);
    }

    // API
    // [GET] /models
    get = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await this.baseService.find({
            page: page,
            pageSize,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    // [POST] /models
    create = async (req, res) => {
        const data = await this.baseService.create({
            ...req.body,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.io.emit('notification', { message: `Thêm ${this.model} thành công!` });

        return res.status(201).json(data);
    };

    // [PUT] /models/:id
    update = async (req, res) => {
        const id = req.params.id;
        const data = await this.baseService.update({
            data: {
                ...req.body,
            },
            where: {
                id,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.io.emit('notification', { message: `${this.model} updated success!` });

        res.json(data);
    };

    // [DELETE] /models/:id
    delete = async (req, res) => {
        const id = req.params.id;

        const data = await this.baseService.delete({
            where: {
                id,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.io.emit('notification', { message: `${this.model} deleted success!` });

        res.json(data);
    };
}

module.exports = BaseController;
