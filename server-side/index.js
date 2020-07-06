const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const registration = require('./routs/registration');
const products = require('./routs/products')
const mongo = require('./mongos');

app.use(cors());
app.use(bodyParser.json());
mongo();
app.use('/registration', registration);
app.use('/products', products);
app.listen(process.env.PORT, () => {

});