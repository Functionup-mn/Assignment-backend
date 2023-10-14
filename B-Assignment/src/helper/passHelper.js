const bcrypt = require("bcrypt");

const hashPassword = async function (password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
};

module.exports = { hashPassword, comparePassword };
