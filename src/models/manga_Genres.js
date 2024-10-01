"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Manga_Genres extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define association here
            Manga_Genres.belongsTo(models.Manga, {
                foreignKey: "manga_id",
                as: "manga",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            });

            Manga_Genres.belongsTo(models.Genre, {
                foreignKey: "genre_id",
                as: "genre",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            });
        }
    }

    Manga_Genres.init(
        {
            manga_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true, // Đặt manga_id là một phần của khóa chính
                references: {
                    model: "Mangas",
                    key: "manga_id",
                },
            },
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true, // Đặt manga_id là một phần của khóa chính
                references: {
                    model: "Genres",
                    key: "genre_id",
                },
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
            modelName: "Manga_Genres",
        }
    );

    return Manga_Genres;
};
