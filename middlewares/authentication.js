const { verifyToken } = require("../helpers/jwt");
const User = require("../models/user");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: 'Unauthenticated' };

    const payload = verifyToken(access_token);

    const currentUser = await User.findById(payload.id);
    // console.log(currentUser, '<<<<<<<<<<<<<<<<<')
    if (!currentUser) throw { name: 'Unauthenticated' };

    req.user = {
      id: currentUser._id,
      email: currentUser.email,
      role: currentUser.role
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authentication };