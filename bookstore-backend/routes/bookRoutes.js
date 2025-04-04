const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { bookId, category, title, price, image, description } = req.body;

        const newBook = new Book({
            bookId,
            category,
            title,
            price,
            image,
            description
        });

        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: parseInt(req.params.id) });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/cart', async (req, res) => {
    try {
        const { bookId, title, price, image, qty } = req.body;
        const newCartItem = { bookId, title, price, image, qty };
        const cart = await Cart.create(newCartItem);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});


module.exports = router;
