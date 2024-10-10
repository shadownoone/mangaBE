'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable('Comments', {
                comment_id: {
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
                    allowNull: true,
                },
                content: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
            })

            .then(() => {
                return queryInterface.addConstraint('Comments', {
                    fields: ['manga_id'],
                    type: 'foreign key',
                    name: 'comments_manga_id_fk',
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
                    fields: ['chapter_id'],
                    type: 'foreign key',
                    name: 'comments_chapter_id_fk',
                    references: {
                        table: 'Chapters',
                        field: 'chapter_id',
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                });
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Comments');
    },
};
