const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    email: { type: String, required: true },
    cartItems: [
        {
            bookId: { type: Number, required: true }, 
            quantity: { type: Number, default: 1 },
            selected: { type: Boolean, default: false},
        }
    ],
});

module.exports = mongoose.model('Cart', CartSchema);
