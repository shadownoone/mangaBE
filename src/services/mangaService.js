const methodsService = require('./index');

const { Manga } = require('../models');

const mangaService = methodsService('Manga');

// Thêm phương thức incrementFollowers
mangaService.incrementFollowers = async (mangaId) => {
    try {
        const [result] = await Manga.sequelize.query(
            'UPDATE mangas SET followers = followers + 1 WHERE manga_id = :mangaId',
            {
                replacements: { mangaId },
                type: Manga.sequelize.QueryTypes.UPDATE,
            },
        );

        return result; // Trả về kết quả nếu cần
    } catch (error) {
        console.error('Error incrementing followers:', error);
        throw new Error(error.message); // Ném lỗi ra ngoài nếu có vấn đề
    }
};

mangaService.decrementFollowers = async (mangaId) => {
    try {
        const result = await Manga.sequelize.query(
            'UPDATE mangas SET followers = followers - 1 WHERE manga_id = :mangaId',
            {
                replacements: { mangaId },
            },
        );

        return result; // Bạn có thể trả về kết quả nếu cần
    } catch (error) {
        console.error('Lỗi khi giảm người theo dõi:', error);
        throw new Error(error.message); // Ném lỗi ra ngoài nếu có vấn đề
    }
};

module.exports = mangaService;
