//===========================================================================================
//    MIGRATION 03: CODE SEQUENCES
//    Creates collision-free monotonic code sequence generator table (LD-, ACC-, CNT-, DL-)
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("code_sequences", {
      prefix: {
        type: Sequelize.STRING(10),
        primaryKey: true,
      },
      next_value: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      pad_length: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 6,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("code_sequences");
  },
};

