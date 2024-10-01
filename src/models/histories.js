const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Histories extends Model {
        static associate(models) {
            // Define associations here
            Histories.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
                onDelete: "CASCADE",
            });
            Histories.belongsTo(models.Manga, {
                foreignKey: "manga_id",
                as: "manga",
                onDelete: "CASCADE",
            });
            Histories.belongsTo(models.Chapter, {
                foreignKey: "chapter_id",
                as: "chapter",
                onDelete: "CASCADE",
            });
        }
    }

    Histories.init(
        {
            history_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            chapter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            last_read_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
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
            modelName: "Histories",
        }
    );

    return Histories;
};
