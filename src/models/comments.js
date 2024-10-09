'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define association here
            Comments.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            Comments.belongsTo(models.Manga, {
                foreignKey: 'manga_id',
                as: 'manga',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            Comments.belongsTo(models.Chapter, {
                foreignKey: 'chapter_id',
                as: 'chapter',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    Comments.init(
        {
            comment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'user_id',
                },
            },
            manga_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Mangas',
                    key: 'manga_id',
                },
            },
            chapter_id: {
                type: DataTypes.INTEGER,

                references: {
                    model: 'Chapters',
                    key: 'chapter_id',
                },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Comments',
            underscored: true,
        },
    );

    return Comments;
};
