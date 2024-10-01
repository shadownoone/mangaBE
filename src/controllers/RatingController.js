const ratingService = require("../services/ratingsService");
const BaseController = require("./BaseController");

class RatingController extends BaseController {
    constructor() {
        super("Ratings");
    }
}

module.exports = new RatingController();
