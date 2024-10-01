"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable("Favorites", {
                favorite_id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                manga_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
            })
            .then(() => {
                return queryInterface.addConstraint("Favorites", {
                    fields: ["user_id"],
                    type: "foreign key",
                    name: "favorites_user_id_fk",
                    references: {
                        table: "Users",
                        field: "user_id",
                    },
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                });
            })
            .then(() => {
                return queryInterface.addConstraint("Favorites", {
                    fields: ["manga_id"],
                    type: "foreign key",
                    name: "favorites_manga_id_fk",
                    references: {
                        table: "Mangas",
                        field: "manga_id",
                    },
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                });
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Favorites");
    },
};
