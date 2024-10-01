"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Favorites extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define association here
            Favorites.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            });

            Favorites.belongsTo(models.Manga, {
                foreignKey: "manga_id",
                as: "manga",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            });
        }
    }

    Favorites.init(
        {
            favorite_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            manga_id: {
                type: DataTypes.INTEGER,
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
            modelName: "Favorites",
        }
    );

    return Favorites;
};
