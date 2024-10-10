'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Chapters', {
                chapter_id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                manga_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false, // Đảm bảo rằng trường này không thể để trống
                },
                chapter_number: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                title: {
                    type: Sequelize.STRING,
                },
                slug: {
                    type: Sequelize.STRING,
                    allowNull: true, // Có thể null nếu không có slug
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
                return queryInterface.addConstraint('Chapters', {
                    fields: ['manga_id'],
                    type: 'foreign key',
                    name: 'chapters_manga_id_fkey', // Tên ràng buộc khóa ngoại
                    references: {
                        table: 'Mangas', // Tên bảng mà `manga_id` tham chiếu tới
                        field: 'manga_id', // Tên trường trong bảng `Mangas`
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE', // Xóa bản ghi trong bảng `Chapters` khi `Mangas` bị xóa
                });
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('Chapters', 'chapters_manga_id_fkey');
        await queryInterface.dropTable('Chapters');
    },
};
