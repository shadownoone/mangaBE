"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Ratings extends Model {
        static associate(models) {
            // Một Rating thuộc về một User
            Ratings.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });

            // Một Rating thuộc về một Manga
            Ratings.belongsTo(models.Manga, {
                foreignKey: "manga_id",
                as: "manga",
            });
        }
    }

    Ratings.init(
        {
            rating_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            manga_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rating: {
                type: DataTypes.FLOAT, // Hoặc DataTypes.DECIMAL(3, 1) nếu cần giá trị thập phân cụ thể
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Ratings",
        }
    );

    return Ratings;
};
