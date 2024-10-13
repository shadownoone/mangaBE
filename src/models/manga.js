'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Manga extends Model {
        static associate(models) {
            // Một Manga có nhiều Chapters

            Manga.hasMany(models.Chapter, {
                foreignKey: 'manga_id',
                as: 'chapters',
            });

            Manga.hasMany(models.Ratings, {
                foreignKey: 'manga_id',
                as: 'ratings',
            });

            Manga.belongsToMany(models.Genre, {
                through: 'Manga_Genres', // Liên kết thông qua bảng Manga_Genres
                foreignKey: 'manga_id',
                as: 'genres', // Đặt bí danh để truy cập genres
            });

            Manga.belongsToMany(models.User, {
                through: models.Favorites, // Join table
                foreignKey: 'manga_id',
                otherKey: 'user_id',
                as: 'favoritedByUsers',
            });
        }
    }

    Manga.init(
        {
            manga_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            author: {
                type: DataTypes.STRING,
            },
            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.TINYINT,
                defaultValue: 0,
            },
            cover_image: {
                type: DataTypes.STRING,
            },
            slug: {
                type: DataTypes.STRING,
            },
            followers: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            is_vip: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Manga',
        },
    );

    return Manga;
};
