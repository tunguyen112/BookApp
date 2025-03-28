require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Đường dẫn thư mục chứa ảnh
const folderPath = path.join(__dirname, 'images');

// Lấy danh sách file ảnh trong thư mục
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Lỗi khi đọc thư mục:", err);
        return;
    }

    // Lọc chỉ lấy file ảnh (định dạng .jpg, .png, .jpeg)
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

    if (imageFiles.length === 0) {
        console.log("Không có ảnh nào trong thư mục.");
        return;
    }

    // Upload từng ảnh lên Cloudinary
    imageFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        cloudinary.uploader.upload(filePath, { folder: "bookstore" })
            .then(result => {
                console.log(`✅ Ảnh ${file} đã upload thành công!`);
                console.log("📌 URL ảnh:", result.secure_url);
            })
            .catch(error => {
                console.error(`❌ Lỗi khi upload ảnh ${file}:`, error);
            });
    });
});
