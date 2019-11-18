import * as Yup from 'yup';
import PublisherHouse from '../models/PublisherHouse';

class PublisherHouseController {
  async index(req, res) {
    const publishers = await PublisherHouse.findAll({
      order: [['nome', 'ASC']],
      limit: 20,
    });

    return res.json(publishers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required()
        .min(3)
        .max(150),
      cnpj: Yup.number()
        .required()
        .min(14),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const publisherExists = await PublisherHouse.findOne({
        where: { cnpj: req.body.cnpj },
      });
      if (publisherExists) {
        return res
          .status(400)
          .json({ errors: { field: 'cnpj', message: 'CNPJ já em uso' } });
      }

      const { id, nome, cnpj } = await PublisherHouse.create(req.body);
      return res.status(201).json({ id, nome, cnpj });
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
      cnpj: Yup.number()
        .required()
        .min(14),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { nome, cnpj } = req.body;

      const publisher = await PublisherHouse.findByPk(req.params.id);

      if (cnpj !== publisher.cnpj) {
        const publisherExists = await PublisherHouse.findOne({
          where: { cnpj },
        });

        if (publisherExists.id !== publisher.id) {
          return res
            .status(400)
            .json({ error: 'Existe uma Editora com o CNPJ selecionado' });
        }
      }

      const { id } = await publisher.update(req.body);
      return res.json({ id, nome, cnpj });
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
    const publisher = await PublisherHouse.findByPk(req.params.id);

    await publisher.destroy();

    return res.json({ message: 'Editora removida com sucesso' });
  }
}

export default new PublisherHouseController();
