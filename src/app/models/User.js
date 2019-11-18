import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            min: 3,
            max: 150,
          },
        },
        idade: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
            min: 1,
          },
        },
        telefone: {
          type: Sequelize.STRING,
          allowNull: false,
          min: 13,
          max: 13,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
            notEmpty: true,
            max: 150,
          },
        },
        senha: Sequelize.VIRTUAL,
        senha_hash: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
          },
        },
        avatar_id: {
          type: Sequelize.INTEGER,
          references: { model: 'files', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.senha) {
        user.senha_hash = await bcrypt.hash(user.senha, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Book, {
      through: 'book_users',
      as: 'books_favoritos',
      foreignKey: 'user_id',
    });
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.senha_hash);
  }
}
export default User;
