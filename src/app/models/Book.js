import Sequelize, { Model } from 'sequelize';

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            min: 3,
            max: 200,
          },
        },
        isbn: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        categoria: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        idioma: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        ano: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
            min: 1,
          },
        },
        publisher_id: {
          type: Sequelize.INTEGER,
          references: { model: 'publisher_houses', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true,
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'autor' });
    this.belongsTo(models.PublisherHouse, {
      foreignKey: 'publisher_id',
      as: 'editora',
    });

    this.belongsToMany(models.User, {
      through: 'book_users',
      as: 'users_favoritos',
      foreignKey: 'book_id',
    });
  }
}
export default Book;
