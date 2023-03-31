const User = require("../models/user");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: 'Unauthenticated' };

    const payload = verifyToken(access_token);

    const currentUser = await User.findByPk(payload.id);
    if (!currentUser) throw { name: 'Unauthenticated' };

    req.user = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authentication };