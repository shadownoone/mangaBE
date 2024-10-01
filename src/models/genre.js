"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Genre extends Model {
        static associate(models) {
            Genre.belongsToMany(models.Manga, {
                through: "Manga_Genres", // Liên kết thông qua bảng Manga_Genres
                foreignKey: "genre_id",
                as: "mangas", // Đặt bí danh để truy cập manga
            });
        }
    }

    Genre.init(
        {
            genre_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Genre",
        }
    );

    return Genre;
};
