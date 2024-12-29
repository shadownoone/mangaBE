'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Mối quan hệ với bảng History
            User.hasMany(models.Histories, {
                foreignKey: 'user_id',
                as: 'histories',
            });

            // Mối quan hệ qua bảng History để lấy Manga và Chapter
            User.belongsToMany(models.Manga, {
                through: models.Histories,
                foreignKey: 'user_id',
                otherKey: 'manga_id',
                as: 'mangas',
            });

            User.belongsToMany(models.Chapter, {
                through: models.Histories,
                foreignKey: 'user_id',
                otherKey: 'chapter_id',
                as: 'chapters',
            });

            User.belongsToMany(models.Manga, {
                through: models.Favorites, // Join table
                foreignKey: 'user_id',
                otherKey: 'manga_id',
                as: 'favoriteMangas',
            });

            User.hasMany(models.Payments, {
                foreignKey: 'user_id',
                as: 'payments',
            });
        }
    }
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
            },
            avatar: {
                type: DataTypes.STRING,
            },
            role: {
                type: DataTypes.TINYINT,
                defaultValue: 0, // Giá trị mặc định là 0 cho người dùng thường
            },
            is_vip: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            vip_expiration: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
