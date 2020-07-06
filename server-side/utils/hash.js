const bcrypt = require('bcryptjs');
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

async function hashPasswordConfirm(password, hashPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch;
    } catch (error) {
        return false;
    }
}

module.exports = { hashPasswordConfirm, hashPassword };