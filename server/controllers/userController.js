const User = require('../models/user');

exports.createUser = async (req, res) => {
  const { uid, name, email } = req.body;

  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, name, email });
      await user.save();
      return res.status(201).json(user);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
