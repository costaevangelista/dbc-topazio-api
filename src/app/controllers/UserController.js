import * as Yup from 'yup';
import User from '../models/User';
import Book from '../models/Book';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const users = await User.findAll({
      order: [['nome', 'ASC']],
      attributes: [
        'id',
        'nome',
        'idade',
        'telefone',
        'email',
        'createdAt',
        'updatedAt',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: Book,
          as: 'books_favoritos',
          attributes: ['id', 'titulo', 'categoria', 'ano'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.json(users);
  }

  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: [
          'id',
          'nome',
          'idade',
          'telefone',
          'email',
          'createdAt',
          'updatedAt',
        ],

        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
          {
            model: Book,
            as: 'books_favoritos',
            attributes: ['id', 'titulo', 'categoria', 'ano'],
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!user) {
        return res.status(400).json({
          errors: { message: 'User não existe' },
        });
      }
      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        errors: { message: 'Erro ao realizar solicitação' },
      });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required()
        .min(3)
        .max(150),
      idade: Yup.number()
        .required()
        .min(1),
      telefone: Yup.string()
        .required()
        .min(13)
        .max(13),
      email: Yup.string()
        .email()
        .max(150)
        .required(),
      senha: Yup.string()
        .required()
        .min(6),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });
      if (userExists) {
        return res
          .status(400)
          .json({ errors: { field: 'email', message: 'E-mail já em uso' } });
      }

      const { id, nome, idade, telefone, email } = await User.create(req.body);
      return res.json({ id, nome, idade, telefone, email });
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
      nome: Yup.string()
        .required()
        .min(3)
        .max(150),
      idade: Yup.number()
        .required()
        .min(1),
      telefone: Yup.string()
        .required()
        .min(13)
        .max(13),
      email: Yup.string()
        .email()
        .max(150)
        .required(),
      oldSenha: Yup.string().min(6),
      senha: Yup.string()
        .min(6)
        .when('oldSenha', (oldSenha, field) =>
          oldSenha ? field.required() : field
        ),
      confirmSenha: Yup.string().when('senha', (senha, field) =>
        senha ? field.required().oneOf([Yup.ref('senha')]) : field
      ),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { email, oldSenha } = req.body;

      const user = await User.findByPk(req.userId);

      if (email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res
            .status(400)
            .json({ error: 'Existe um Usuário com o e-mail selecionado' });
        }
      }

      if (oldSenha && !(await user.checkPassword(oldSenha))) {
        return res.status(401).json({ error: 'Senha anterior não confere' });
      }

      const { id, nome, idade, telefone } = await user.update(req.body);
      return res.json({ id, nome, idade, telefone, email });
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
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: { message: 'Usuário não existe' },
        });
      }

      await user.destroy();

      return res.json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
      return res.status(400).json({
        errors: { message: 'Erro ao realizar solicitação' },
      });
    }
  }
}

export default new UserController();
