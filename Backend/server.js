const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// --- CẤU HÌNH ---
app.use(cors());
app.use(express.json());

// 1. Cấu hình IP máy tính (Để hiển thị ảnh)
// Hãy thay bằng IP Wifi thật của bạn (Ví dụ: 192.168.1.194)
const IP_MAY_TINH = '192.168.1.194'; 

// 2. Kết nối tới Kho MongoDB (Đã điền sẵn Password: admin123)
const MONGO_URI = 'mongodb+srv://admin:admin123@cluster0.dn2h4u6.mongodb.net/petshop?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Đã kết nối thành công với MongoDB Atlas!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// --- TẠO CẤU TRÚC DỮ LIỆU (SCHEMA) ---
// Định nghĩa xem một món hàng gồm những gì
const ProductSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: String,
    img: String,
    desc: String
});

const Product = mongoose.model('Product', ProductSchema);

// --- DỮ LIỆU MẪU (Để nạp vào kho nếu kho rỗng) ---
const sampleProducts = [
    {
        id: 1,
        name: 'Hạt Royal Canin',
        price: '350.000đ',
        img: `http://${IP_MAY_TINH}:3000/images/dog.jpg`, // Nhớ đảm bảo trong thư mục images có file dog.jpg
        desc: 'Thức ăn hạt cho chó trưởng thành, giúp lông bóng mượt.'
    },
    {
        id: 2,
        name: 'Pate Mèo Whiskas',
        price: '45.000đ',
        img: `http://${IP_MAY_TINH}:3000/images/cat.jpg`, // Nhớ đảm bảo có file cat.jpg
        desc: 'Pate cá ngừ thơm ngon, bổ sung Omega 3 & 6.'
    },
    {
        id: 3,
        name: 'Sữa tắm SOS',
        price: '120.000đ',
        img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800',
        desc: 'Sữa tắm khử mùi, lưu hương lâu cho thú cưng.'
    }
];

// Hàm kiểm tra và nạp dữ liệu mẫu
async function seedDatabase() {
    const count = await Product.countDocuments();
    if (count === 0) {
        console.log('-> Kho đang rỗng. Đang tiến hành nhập hàng mẫu...');
        await Product.insertMany(sampleProducts);
        console.log('-> Đã nhập xong 3 món hàng mẫu!');
    } else {
        console.log('-> Kho đã có hàng (' + count + ' sản phẩm). Không cần nhập thêm.');
    }
}
// Chạy hàm nạp dữ liệu ngay khi khởi động
seedDatabase();

// --- CÁC ĐƯỜNG DẪN (API) ---

// 1. Cung cấp ảnh tĩnh
app.use('/images', express.static('images'));

// 2. Lấy danh sách sản phẩm TỪ MONGODB
app.get('/api/products', async (req, res) => {
    try {
        console.log('-> Có người hỏi mua hàng. Đang lấy từ kho MongoDB...');
        const products = await Product.find(); // Lệnh lấy toàn bộ dữ liệu thật
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- KHỞI ĐỘNG SERVER ---
app.listen(3000, '0.0.0.0', () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Bếp đã nổi lửa! Server chạy tại: http://${IP_MAY_TINH}:3000`);
    console.log('-------------------------------------------');
});