'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Manga_Genres', {
                manga_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                genre_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
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
                return queryInterface.addConstraint('Manga_Genres', {
                    fields: ['manga_id'],
                    type: 'foreign key',
                    name: 'manga_genres_manga_id_fk', // Tên của ràng buộc khóa ngoại
                    references: {
                        table: 'Mangas',
                        field: 'manga_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            })
            .then(() => {
                return queryInterface.addConstraint('Manga_Genres', {
                    fields: ['genre_id'],
                    type: 'foreign key',
                    name: 'manga_genres_genre_id_fk', // Tên của ràng buộc khóa ngoại
                    references: {
                        table: 'Genres',
                        field: 'genre_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Manga_Genres');
    },
};
