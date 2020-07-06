const express = require('express');
const registration = express();
const UserModel = require('../models/user');
const { address } = require('../utils/address');
const { firstFazeValidation, secondFazeValidation, saveUser } = require('../utils/formvalidations');
const { getJwt } = require('../utils/jwt');
const { hashPasswordConfirm } = require('../utils/hash');
const { price } = require('../utils/calculatePrice');
const jwt = require('jsonwebtoken');

registration.post('/login', async(req, res, next) => {
    try {
        const { idNumber, password } = req.body;
        const [userFromDB] = await UserModel.find({ idNumber: idNumber });
        const auth = await hashPasswordConfirm(password, userFromDB.hash);

        if (!userFromDB || !auth) throw new error();
        const jwt = await getJwt(req.body);

        res.json({
            token: jwt,
            user: userFromDB
        });
    } catch (error) {

        res.json({ userNotFound: 'wrong deteils' }).status(500);
    }
});
registration.get('/getUser', async(req, res, next) => {
    try {
        const { authorization } = req.headers;

        const token = authorization.split(' ')[1];

        const user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (!decoded) throw new error();
            return decoded;
        });

        const [userFromToken] = await UserModel.find({ idNumber: user.idNumber });

        res.json(userFromToken);
    } catch (error) {

        res.json({ userNotFound: 'wrong deteils' }).status(500);
    }
});

registration.get('/location', async(req, res, next) => {
    try {
        res.json(address);
    } catch (error) {

    }
});

registration.use(async(req, res, next) => {
    try {
        const success = await firstFazeValidation(req.body);
        if (!success) throw new error();

        next();
    } catch (error) {
        res.json({ message: 'somthing went wrong, try again' }).status(500);
    }
});

registration.post('/registerFirstFaze', async(req, res, next) => {
    try {
        const { idNumber, email } = req.body;
        const [user] = await UserModel.find({ idNumber: idNumber });
        const [userMail] = await UserModel.find({ email: email });

        if (user) return res.json({ message: 'user id alredy exsist ' });
        if (userMail) return res.json({ message: 'email alredy exsist ' });
        res.status(200).json({ success: true });
    } catch (error) {
        res.json({ message: 'somthing went wrong try again' }).status(500);
    }
});

registration.use(async(req, res, next) => {
    try {
        const success = await secondFazeValidation(req.body);

        if (!success) throw new error();
        next();
    } catch (error) {
        res.json({ err: 'somthing went wrong, try again' }).status(500);
    }
});

registration.post('/completeRegistration', async(req, res, next) => {
    try {
        const success = await saveUser(req.body);

        if (!success) throw new error();
        const jwt = await getJwt(req.body);
        res.json({ token: jwt }).status(200);
    } catch (error) {

        res.json({ err: 'somthing went wrong try again' }).status(500);
    }
});

module.exports = registration;