import * as Yup from 'yup';
import Book from '../models/Book';
import User from '../models/User';
import PublisherHouse from '../models/PublisherHouse';

class BookController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const books = await Book.findAll({
      order: [['titulo', 'ASC']],
      attributes: [
        'id',
        'titulo',
        'isbn',
        'categoria',
        'idioma',
        'ano',
        'createdAt',
        'updatedAt',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'autor',
          attributes: ['id', 'nome'],
        },
        {
          model: PublisherHouse,
          as: 'editora',
          attributes: ['id', 'nome'],
        },
        {
          model: User,
          as: 'users_favoritos',
          attributes: ['id', 'nome'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.json(books);
  }

  async show(req, res) {
    try {
      const book = await Book.findByPk(req.params.id, {
        attributes: [
          'id',
          'titulo',
          'isbn',
          'categoria',
          'idioma',
          'ano',
          'createdAt',
          'updatedAt',
        ],

        include: [
          {
            model: User,
            as: 'autor',
            attributes: ['id', 'nome'],
          },
          {
            model: PublisherHouse,
            as: 'editora',
            attributes: ['id', 'nome'],
          },
          {
            model: User,
            as: 'users_favoritos',
            attributes: ['id', 'nome'],
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!book) {
        return res.status(400).json({
          errors: { message: 'Livro não existe' },
        });
      }
      return res.json(book);
    } catch (error) {
      return res.status(400).json({
        errors: { message: 'Erro ao realizar solicitação' },
      });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string()
        .required()
        .min(3)
        .max(150),
      isbn: Yup.number()
        .required()
        .min(13),
      categoria: Yup.string().required(),
      ano: Yup.number()
        .required()
        .min(4),
      publisher_id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const publisherExists = await PublisherHouse.findByPk(
        req.body.publisher_id
      );

      const autorUserExists = await User.findByPk(req.body.user_id);

      if (!publisherExists || !autorUserExists) {
        return res.status(400).json({
          errors: { field: 'titulo', message: 'Autor | Editora não existe' },
        });
      }

      const bookIsbnExists = await Book.findOne({
        where: { isbn: req.body.isbn },
      });
      if (bookIsbnExists) {
        return res
          .status(400)
          .json({ errors: { field: 'isbn', message: 'ISBN já em uso' } });
      }

      const {
        id,
        titulo,
        isbn,
        categoria,
        idioma,
        ano,
        createdAt,
        updatedAt,
      } = await Book.create(req.body);
      return res.status(201).json({
        id,
        titulo,
        isbn,
        categoria,
        idioma,
        ano,
        createdAt,
        updatedAt,
      });
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

      return res.status(400).json({ errors });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string()
        .required()
        .min(3)
        .max(150),
      isbn: Yup.number()
        .required()
        .min(13),
      categoria: Yup.string().required(),
      ano: Yup.number()
        .required()
        .min(4),
      publisher_id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { isbn } = req.body;

      const book = await Book.findByPk(req.params.id);

      if (isbn !== book.isbn) {
        const bookExists = await Book.findOne({
          where: { isbn },
        });

        if (bookExists.id !== book.id) {
          return res
            .status(400)
            .json({ error: 'Existe um Livro com o ISBN selecionado' });
        }
      }

      const {
        id,
        titulo,
        categoria,
        idioma,
        ano,
        createdAt,
        updatedAt,
      } = await book.update(req.body);
      return res.json({
        id,
        titulo,
        isbn,
        categoria,
        idioma,
        ano,
        createdAt,
        updatedAt,
      });
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

      return res.status(400).json({ errors });
    }
  }

  async delete(req, res) {
    try {
      const book = await Book.findByPk(req.params.id);

      if (!book) {
        return res.status(400).json({
          errors: { message: 'Livro não existe' },
        });
      }

      await book.destroy();

      return res.json({ message: 'Book removido com sucesso' });
    } catch (error) {
      return res.status(400).json({
        errors: { message: 'Erro ao realizar solicitação' },
      });
    }
  }
}

export default new BookController();
