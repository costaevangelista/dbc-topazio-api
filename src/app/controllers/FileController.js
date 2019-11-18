import File from '../models/File';
import User from '../models/User';

class Filecontroller {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });
    const user = await User.findByPk(req.userId);
    await user.setAvatar(file);

    return res.json(file);
  }
}

export default new Filecontroller();
