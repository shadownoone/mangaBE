'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Chapter_Images extends Model {
        static associate(models) {
            // Định nghĩa các mối quan hệ tại đây
            Chapter_Images.belongsTo(models.Chapter, {
                foreignKey: 'chapter_id',
                as: 'chapter',
                onDelete: 'CASCADE',
            });
        }
    }

    Chapter_Images.init(
        {
            image_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            chapter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            image_url: {
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
            modelName: 'Chapter_Images',
        },
    );

    return Chapter_Images;
};
