const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// --- CẤU HÌNH ---
app.use(cors());
app.use(express.json());

// 1. Cấu hình IP máy tính (Quan trọng để điện thoại load được ảnh)
const IP_MAY_TINH = '192.168.1.132'; 

// 2. Kết nối tới Kho MongoDB
mongoose.connect('mongodb+srv://ADMIN:h6DZQ0dncSUP27NG@cluster0.tup3ldo.mongodb.net/PetShopDB?appName=Cluster0')
  .then(() => console.log('✅ Đã kết nối thành công với MongoDB Atlas!'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// --- TẠO CẤU TRÚC DỮ LIỆU ---
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: String,
  img: String,
  desc: String
});
const Product = mongoose.model('Product', productSchema);

// --- DỮ LIỆU MẪU (Sử dụng ảnh trong thư mục images của bạn) ---
// Lưu ý: Dùng dấu backtick (`) thay vì dấu nháy đơn (') để chèn được IP
const sampleProducts = [
  {
    id: 1,
    name: 'Hạt Royal Canin',
    price: '350.000 đ',
    img: `http://${IP_MAY_TINH}:${port}/images/dog.png`, // Ảnh từ máy bạn
    desc: 'Thức ăn hạt cho chó trưởng thành, giúp lông bóng mượt.'
  },
  {
    id: 2,
    name: 'Pate Mèo Whiskas',
    price: '45.000 đ',
    img: `http://${IP_MAY_TINH}:${port}/images/cat.png`,
    desc: 'Pate cá ngừ thơm ngon, bổ sung Omega 3 & 6.'
  },
  {
    id: 3,
    name: 'Sữa tắm SOS',
    price: '120.000 đ',
    img: `http://${IP_MAY_TINH}:${port}/images/suatam.png`,
    desc: 'Sữa tắm khử mùi, lưu hương lâu cho thú cưng.'
  }
];

// Hàm nạp dữ liệu mẫu
const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('-> Kho đang rỗng. Đang tiến hành nhập hàng mẫu...');
      await Product.insertMany(sampleProducts);
      console.log('-> Đã nhập xong 3 món hàng mẫu (Có ảnh)!');
    } else {
      console.log(`-> Kho đã có hàng (${count} sản phẩm).`);
    }
  } catch (error) {
    console.log("Lỗi kiểm tra kho:", error);
  }
};
mongoose.connection.once('open', seedDatabase);

// --- CÁC ĐƯỜNG DẪN (API) ---

// 1. Mở cửa kho ảnh để điện thoại vào lấy
// Server sẽ tìm file trong thư mục "images" cùng cấp với server.js
app.use('/images', express.static('images')); 

// 2. API Gửi danh sách sản phẩm (Đã sửa thành /products cho khớp với App)
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- KHỞI ĐỘNG SERVER ---
app.listen(port, '0.0.0.0', () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Server đang chạy tại: http://${IP_MAY_TINH}:${port}`);
    console.log(`📷 Link ảnh mẫu: http://${IP_MAY_TINH}:${port}/images/cat.png`);
    console.log('-------------------------------------------');
});