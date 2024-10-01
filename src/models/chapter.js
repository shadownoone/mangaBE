"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Chapter extends Model {
        static associate(models) {
            // Định nghĩa các mối quan hệ tại đây
            // Ví dụ:
            Chapter.belongsTo(models.Manga, {
                foreignKey: "manga_id",
                as: "manga", // Tên alias cho quan hệ
            });
            // Một Chapter có nhiều hình ảnh
            Chapter.hasMany(models.Chapter_Images, {
                foreignKey: "chapter_id",
                as: "images",
            });
        }
    }

    Chapter.init(
        {
            chapter_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            manga_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            chapter_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
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
            slug: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Chapter",
        }
    );

    return Chapter;
};
