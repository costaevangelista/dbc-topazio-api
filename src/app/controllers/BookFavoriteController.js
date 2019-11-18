import Book from '../models/Book';
import User from '../models/User';

class BookFavoriteController {
  async store(req, res) {
    try {
      const user = await User.findByPk(req.userId);
      const book = await Book.findByPk(req.params.id);

      if (!book) {
        return res.status(400).json({
          errors: { message: 'Livro não existe' },
        });
      }

      await book.setUsers_favoritos(user);
      return res
        .status(201)
        .json({ message: 'Processo realizado com sucesso' });
    } catch (err) {
      const errors = [];

      /** Displayed errors based on origin of validation */
      /** Verify validation Yup */
      if (err.inner) {
        err.inner.map(e =>
          errors.push({
            field: e.path,
            message: e.message,
          })
        );
        return res.status(400).json({ errors });
      }

      /** Verify validation Sequelize */
      err.errors.map(e =>
        errors.push({
          field: e.path,
          message: e.message,
        })
      );

      return res.status(400).json({ err });
    }
  }
}

export default new BookFavoriteController();
