import Sequelize, { Model } from 'sequelize';

class PublisherHouse extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            min: 3,
            max: 200,
          },
        },
        cnpj: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
            min: 14,
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default PublisherHouse;
