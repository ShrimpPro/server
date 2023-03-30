const bcrypt = require('bcrypt');

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = { hashPassword, comparePassword };