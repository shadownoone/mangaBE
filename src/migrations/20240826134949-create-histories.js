'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Histories', {
                history_id: {
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
                chapter_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                last_read_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
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
                return queryInterface.addConstraint('Histories', {
                    fields: ['manga_id'],
                    type: 'foreign key',
                    name: 'history_manga_id_fk',
                    references: {
                        table: 'Mangas',
                        field: 'manga_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            })
            .then(() => {
                return queryInterface.addConstraint('Histories', {
                    fields: ['chapter_id'],
                    type: 'foreign key',
                    name: 'history_chapter_id_fk',
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
        await queryInterface.dropTable('Histories');
    },
};
