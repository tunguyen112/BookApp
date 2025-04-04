const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Book = require('../models/Book');

router.post('/add', async (req, res) => {
    const { email, bookId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ email });

        if (!cart) {
            cart = new Cart({ email, cartItems: [] });
        }

        const book = await Book.findOne({ bookId });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.bookId === bookId);

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += quantity;
        } else {
            cart.cartItems.push({ bookId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const cart = await Cart.findOne({ email });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const bookIds = cart.cartItems.map(item => item.bookId);
        const books = await Book.find({ bookId: { $in: bookIds } }); 
        const cartWithDetails = cart.cartItems.map(item => {
            const book = books.find(b => b.bookId === item.bookId);
            return {
                bookId: item.bookId,
                quantity: item.quantity,
                title: book ? book.title : "Unknown",
                price: book ? book.price : 0,
                image: book ? book.image : "",
            };
        });

        res.status(200).json({ email, cartItems: cartWithDetails });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.post('/update', async (req, res) => {
    const { email, bookId, change } = req.body;

    try {
        let userCart = await Cart.findOne({ email });

        if (!userCart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }

        let item = userCart.cartItems.find(item => item.bookId === bookId);
        
        if (!item) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        if (item.quantity <= 1 && change === -1) {
            return res.status(400).json({ message: "Số lượng không thể nhỏ hơn 1" });
        }

        item.quantity += change;

        await userCart.save();
        res.json({ cartItems: userCart.cartItems });
    } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.post('/remove', async (req, res) => {
    const { email, bookId } = req.body;

    try {
        let cart = await Cart.findOne({ email });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.cartItems = cart.cartItems.filter(item => item.bookId !== bookId);

        await cart.save();
        res.status(200).json({ message: "Item removed successfully", cartItems: cart.cartItems });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.post('/checkout', async (req, res) => {
    const { email, bookIds } = req.body;
  
    if (!email || !bookIds || bookIds.length === 0) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
  
    try {
      // Tìm các sản phẩm trong giỏ hàng của người dùng
      const cartItems = await Cart.find({ email, bookId: { $in: bookIds } });
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }
  
      // Tính tổng tiền
      const totalPrice = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity; // Tổng tiền = giá * số lượng
      }, 0);
  
      res.json({ totalPrice });
    } catch (error) {
      console.error('Lỗi khi tính tổng tiền:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi tính tổng tiền' });
    }
  });

module.exports = router;
