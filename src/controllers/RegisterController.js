const BaseController = require('./BaseController');

class RegisterController extends BaseController {
    constructor() {
        super('register');
    }

    // [GET] /models
    get = async (req, res) => {};

    analysis = async (req, res, next) => {};
}

module.exports = new RegisterController();
