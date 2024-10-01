"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
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
            password: {
                type: Sequelize.STRING,
                allowNull: false, // Đảm bảo rằng trường này không thể để trống
            },
            role: {
                type: Sequelize.TINYINT, // Thay đổi từ STRING thành TINYINT để đồng bộ với mô hình
                defaultValue: 0, // Giá trị mặc định cho trường role
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
