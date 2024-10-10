'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Ratings', {
                rating_id: {
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
                rating: {
                    type: Sequelize.FLOAT, // Hoặc Sequelize.DECIMAL(3, 1) nếu bạn cần giá trị thập phân cụ thể
                    allowNull: false,
                    validate: {
                        min: 1,
                        max: 5,
                    },
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
                return queryInterface.addConstraint('Ratings', {
                    fields: ['manga_id'],
                    type: 'foreign key',
                    name: 'ratings_manga_id_fk',
                    references: {
                        table: 'Mangas',
                        field: 'manga_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Ratings');
    },
};
