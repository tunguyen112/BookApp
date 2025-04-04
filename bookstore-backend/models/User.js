const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String, 
    phonenumber: String,
    housenumber: String,
    street: String,
    city: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);