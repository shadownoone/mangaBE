const bcrypt = require('bcryptjs');
const db = require('~/models');

const methodsService = require('./index');

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

const getReadingHistory = async (user_id) => {
    try {
        const history = await db.Histories.findAll({
            where: { user_id: user_id },
            order: [['last_read_at', 'DESC']], // Sắp xếp theo thời gian đọc gần nhất
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'username', 'email', 'avatar', 'role', 'createdAt', 'updatedAt'],
                },
                {
                    model: db.Manga,
                    as: 'manga',
                    attributes: ['title', 'cover_image', 'slug'],
                },
                {
                    model: db.Chapter,
                    as: 'chapter',
                    attributes: ['title', 'chapter_number', 'slug'],
                },
            ],
        });

        return history;
    } catch (error) {
        console.error('Error fetching reading history:', error);
        throw error;
    }
};

const getFavoritesByUser = async (user_id) => {
    try {
        const favorites = await db.Favorites.findAll({
            where: { user_id },
            include: [
                {
                    model: db.Manga,
                    as: 'manga',
                    attributes: ['manga_id', 'title', 'cover_image', 'slug'],
                },
                {
                    model: db.User,
                    as: 'user', // Include user information
                    attributes: ['user_id', 'username', 'email', 'avatar', 'role', 'createdAt', 'updatedAt'],
                },
            ],
        });
        return favorites;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};

module.exports = { ...methodsService('User'), hashPassword, getReadingHistory, getFavoritesByUser };
