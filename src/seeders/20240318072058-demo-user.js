"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("Manga_Genres", [
            {
                manga_id: 5,
                genre_id: 8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                manga_id: 5,
                genre_id: 9,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                manga_id: 5,
                genre_id: 10,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
