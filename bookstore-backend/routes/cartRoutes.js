const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate({
            path: 'cartItems.bookId',
            select: 'title price image'
        });

        if (!cart) return res.status(404).json({ message: 'Giỏ hàng trống' });

        res.json(cart.cartItems);
    } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { userId, bookId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, cartItems: [] });
        }

        const existingItem = cart.cartItems.find(item => item.bookId.toString() === bookId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity <= 0) {
                cart.cartItems = cart.cartItems.filter(item => item.bookId.toString() !== bookId);
            }
        } else {
            cart.cartItems.push({ bookId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Lỗi thêm sách vào giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.delete('/remove/:userId/:bookId', async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Giỏ hàng trống' });

        cart.cartItems = cart.cartItems.filter(item => item.bookId.toString() !== bookId);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Lỗi xóa sách:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.delete('/clear/:userId', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
    } catch (error) {
        console.error('Lỗi xóa giỏ hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/total/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate({
            path: 'cartItems.bookId',
            select: 'price'
        });

        if (!cart) return res.json({ total: 0 });

        const total = cart.cartItems.reduce((sum, item) => sum + item.bookId.price * item.quantity, 0);
        
        res.json({ total });
    } catch (error) {
        console.error('Lỗi tính tổng tiền:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;
