const { Ratings } = require('../models'); // Điều chỉnh đường dẫn nếu cần

const methodsService = require('./index');

const ratingService = methodsService('Ratings');

ratingService.getAverageRating = async (mangaId) => {
    try {
        const [result] = await Ratings.sequelize.query(
            'SELECT AVG(rating) AS averageRating FROM Ratings WHERE manga_id = :mangaId',
            {
                replacements: { mangaId },
                type: Ratings.sequelize.QueryTypes.SELECT,
            },
        );

        return result.averageRating || 0; // Gán 0 nếu không có rating
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = ratingService;
