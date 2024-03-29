import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import PublisherHouse from '../app/models/PublisherHouse';
import Book from '../app/models/Book';

import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, PublisherHouse, Book, File];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
