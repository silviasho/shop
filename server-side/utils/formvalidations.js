const Joi = require('@hapi/joi');
const { hashPassword } = require('../utils/hash');
const UserModel = require('../models/user');

const firstFazeValidation = async(data) => {
    try {
        const { idNumber, password, passwordConfirm, email } = data;
        const schema = Joi.object({
            idNumber: Joi.number().min(11111111).max(999999999).required(),
            password: Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required(),
            email: Joi.string().email().required()
        });
        const value = await schema.validate({
            idNumber,
            password,
            email
        });
        const { error } = value;
        if (error || password !== passwordConfirm) throw new Error();
        return true;
    } catch (error) {
        return false;
    }
};

const secondFazeValidation = async(data) => {
    try {
        const { firstName, lastName, country, city } = data;
        if (!firstName || !lastName || !country || !city) throw new Error();
        return true;
    } catch (error) {
        return false;
    }
};

const saveUser = async(user) => {
    try {
        const { idNumber, email, password, passwordConfirm, firstName, lastName, country, city } = user;
        const hash = await hashPassword(password);
        const newUser = new UserModel({
            idNumber,
            email,
            hash,
            firstName,
            lastName,
            country,
            city
        });

        const dbRes = await newUser.save();

        if (!dbRes._id) throw new error;
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { firstFazeValidation, secondFazeValidation, saveUser };