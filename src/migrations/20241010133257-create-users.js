'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Users', {
                user_id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                username: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false, // Đảm bảo rằng trường này không thể để trống
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false, // Đảm bảo rằng trường này không thể để trống
                },
                avatar: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                phone: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false, // Đảm bảo rằng trường này không thể để trống
                },
                role: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false, // Giá trị mặc định cho trường role
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW, // Đặt giá trị mặc định là thời gian hiện tại
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW, // Đặt giá trị mặc định là thời gian hiện tại
                },
            })
            .then(() => {
                return queryInterface.addConstraint('Favorites', {
                    fields: ['manga_id'],
                    type: 'foreign key',
                    name: 'favorites_manga_id_fk',
                    references: {
                        table: 'Mangas',
                        field: 'manga_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            })
            .then(() => {
                return queryInterface.addConstraint('Comments', {
                    fields: ['user_id'],
                    type: 'foreign key',
                    name: 'comments_user_id_fk',
                    references: {
                        table: 'Users',
                        field: 'user_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            })
            .then(() => {
                return queryInterface.addConstraint('Ratings', {
                    fields: ['user_id'],
                    type: 'foreign key',
                    name: 'ratings_user_id_fk',
                    references: {
                        table: 'Users',
                        field: 'user_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            })
            .then(() => {
                return queryInterface.addConstraint('Histories', {
                    fields: ['user_id'],
                    type: 'foreign key',
                    name: 'history_user_id_fk',
                    references: {
                        table: 'Users',
                        field: 'user_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
