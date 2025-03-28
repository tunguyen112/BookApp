const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: Number,
    category: String,
    title: String,
    price: Number,
    image: String, 
    description: String
});

module.exports = mongoose.model('Book', bookSchema);
