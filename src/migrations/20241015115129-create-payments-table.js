'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface
            .createTable('Payments', {
                payment_id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                amount: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                order_code: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    unique: true,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            })
            .then(() => {
                return queryInterface.addConstraint('Payments', {
                    fields: ['user_id'],
                    type: 'foreign key',
                    name: 'fk_payments_user_id', // Tên khóa ngoại
                    references: {
                        table: 'Users',
                        field: 'user_id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                });
            });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Payments');
    },
};
