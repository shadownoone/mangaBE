'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Payments extends Model {
        static associate(models) {
            // Một Payment thuộc về một User
            Payments.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
            });
        }
    }

    Payments.init(
        {
            payment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2), // Sử dụng kiểu dữ liệu DECIMAL cho số tiền
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING, // Có thể thay đổi thành DataTypes.ENUM nếu bạn muốn
                allowNull: false,
            },
            order_code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // Đảm bảo mã đơn hàng là duy nhất
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Payments',
            tableName: 'Payments',
        },
    );

    return Payments;
};
