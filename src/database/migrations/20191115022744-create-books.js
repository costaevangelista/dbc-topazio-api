module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('books', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      idioma: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      isbn: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ano: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      publisher_id: {
        type: Sequelize.INTEGER,
        references: { model: 'publisher_houses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: queryInterface => {
    return queryInterface.dropTable('books');
  },
};
