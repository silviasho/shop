const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URL}/${process.env.DB_NAME}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

    } catch (ex) {
        res.json({ err: 'err' })

    }
};

module.exports = dbConnection;