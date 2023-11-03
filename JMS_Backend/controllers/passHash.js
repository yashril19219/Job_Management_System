
const bcrypt = require('bcrypt');

const hashPassword =  async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
  
  // Function to compare a password with a hashed password
const comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }
}
  
module.exports = { hashPassword, comparePasswords };
