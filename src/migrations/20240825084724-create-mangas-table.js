'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Mangas', {
            manga_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            author: {
                type: Sequelize.STRING,
            },
            views: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            cover_image: {
                type: Sequelize.STRING,
            },
            slug: {
                type: Sequelize.STRING, // Thêm trường slug
                allowNull: true, // Có thể null nếu không có slug
            },
            followers: {
                type: Sequelize.INTEGER,
                defaultValue: 0, // Thêm trường followers
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Mangas');
    },
};
