const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        res.status(200).json({ message: "Đăng nhập thành công!", username: user.username });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, username, email, phonenumber, housenumber, street, city, password } = req.body;

        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc Email đã tồn tại." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            phonenumber,
            housenumber,
            street,
            city,
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Mật khẩu đã được cập nhật!" });
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.post('/change-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Mật khẩu đã được cập nhật!" });
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.put('/:email', async (req, res) => {
    try {
        const { firstname, lastname, username, phonenumber, housenumber, street, city } = req.body;

        const user = await User.findOneAndUpdate(
            { email: req.params.email }, 
            { firstname, lastname, username, phonenumber, housenumber, street, city },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        res.status(200).json({ message: "Cập nhật thành công!", user });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
