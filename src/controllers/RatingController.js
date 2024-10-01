const ratingService = require('../services/ratingsService');
const BaseController = require('./BaseController');

class RatingController extends BaseController {
    constructor() {
        super('ratings');
    }
}

module.exports = new RatingController();
