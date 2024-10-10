'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Chapter_Images', {
                image_id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                chapter_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                image_url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                image_order: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
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
                return queryInterface.addConstraint('Chapter_Images', {
                    fields: ['chapter_id'],
                    type: 'foreign key',
                    name: 'chapter_images_chapter_id_fk', // Tên của ràng buộc khóa ngoại
                    references: {
                        table: 'Chapters',
                        field: 'chapter_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Chapter_Images');
    },
};
