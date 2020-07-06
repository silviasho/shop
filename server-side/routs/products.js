const express = require('express');
const products = express();
const productsItems = require('../utils/itemsBackUp.json');
const ProductsModel = require('../models/products');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const { price } = require('../utils/calculatePrice');



products.get('/categury', async(req, res, next) => {
    try {
        const categories = await ProductsModel.distinct('category');
        res.json(categories);
    } catch (error) {

        res.json({ err: 'fail' });
    }
});

products.use(async(req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (!decoded) throw new error();
            return decoded;
        });
        const [userFromToken] = await UserModel.find({ idNumber: user.idNumber });
        if (!userFromToken) throw new error();
        req.user = userFromToken;
        next();
    } catch (error) {
        res.json({ err: 'some error login again' });
    }
});

products.get('/fatchItems/:category', async(req, res, next) => {
    try {
        const { category } = req.params;
        const searchKey = new RegExp(category, 'i');
        const items = await ProductsModel.find({
            $or: [{ productName: searchKey }, { category: searchKey }]
        });

        res.json(items);
    } catch (error) {
        res.json({ message: 'fail' });
    }
});

products.get('/search/:value', async(req, res, next) => {
    try {

        const { value } = req.params;
        const searchKey = new RegExp(value, 'i');
        const products = await ProductsModel.find({ productName: searchKey }, function(err, product) {
            if (err) throw new error();
        });
        res.json(products);
    } catch (error) {

        res.json({ message: 'err' });
    }
});

products.get('/getCart', async(req, res, next) => {
    try {
        const { user } = req;
        const [userCart] = await UserModel.find({ _id: user.id }, { cart: [] });
        res.json(userCart.cart);
    } catch (error) {}
});

products.post('/completePurchese', async(req, res, next) => {
    try {
        const { details } = req.body;
        const { user } = req;
        await UserModel.findOneAndUpdate({ idNumber: user.idNumber }, {
            $push: {
                orders: {
                    product: user.cart,
                    details: details
                }
            }
        });
        await UserModel.updateOne({ idNumber: user.idNumber }, { $set: { cart: [], totalPrice: 0 } })
        const [updatedUser] = await UserModel.find({ idNumber: user.idNumber });
        res.json({ message: 'order competed', updatedUser });
    } catch (error) {

        res.json({ messae: 'fail' });
    }
});

products.post('/removeFromCart', async(req, res, next) => {
    try {
        const { code } = req.body;

        const { user } = req;
        await UserModel.updateOne({
            idNumber: user.idNumber
        }, { $pull: { cart: { code: code } } });


        const [upDatedUserCart] = await UserModel.find({ _id: user.id });
        const updatedPrice = await price(upDatedUserCart.cart);

        await UserModel.updateOne({
            idNumber: user.idNumber
        }, {
            $set: {
                totalPrice: updatedPrice
            }
        });

        const [updatedUser] = await UserModel.find({ _id: user.id });

        res.json({ user: updatedUser });
    } catch (error) {
        res.json({ err: 'err' }).status(500);
    }
});
products.get('/productsByGender/:gender/:category', async(req, res, next) => {
    try {
        const { gender, category } = req.params;
        const products = await ProductsModel.find({ gender: gender, category: category });

        res.json(products);
    } catch (error) {
        res.json({ err: 'err' }).status(500);
    }
});

products.use(async(req, res, next) => {
    try {
        const { item, userReq } = req.body;
        const { user } = req;
        if (!userReq.size) {
            return res.json({ message: 'select size ,product not added' });
        }
        const [userCart] = await UserModel.find({ _id: user.id }, { cart: [] });
        req.newItem = item;
        req.userReq = userReq;
        req.userCart = userCart;
        next();
    } catch (error) {

        res.json({ err: 'some error login again' });
    }
});

products.post('/addToCart', async(req, res, next) => {
    try {
        const { user, newItem, userReq, userCart } = req;
        const ID = '_' + Math.random().toString(36).substr(2, 9);

        newItem.sizeInStock = userReq.size;
        newItem.code = ID;
        await UserModel.findOneAndUpdate({
            idNumber: user.idNumber
        }, { $push: { cart: newItem } });
        const [upDatedUserCart] = await UserModel.find({ _id: user.id });
        const updatedPrice = await price(upDatedUserCart.cart);

        await UserModel.updateOne({
            idNumber: user.idNumber
        }, {
            $set: {
                totalPrice: updatedPrice
            }
        });
        const [updatedUser] = await UserModel.find({ _id: user.id });
        res.json({ message: 'item saved in cart', user: updatedUser });
    } catch (error) {

        res.json({ messae: 'fail' });
    }
});

module.exports = products;