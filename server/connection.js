const mongoose = require('mongoose')
const url = process.env.URL

const connectDB = () => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("mongodb is connected");
    }).catch((error) => {
        console.log("mondb not connected");
        console.log(error);
    })
};
module.exports = connectDB