const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "doducthanh23@$",
  database: "cameratraffic",
});

// Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.error("Kết nối MySQL thất bại:", err);
    return;
  }
  console.log("Kết nối MySQL thành công!");
});

// Middleware
app.use(cors());
app.use(express.json());
// Phục vụ file tĩnh từ thư mục gốc
app.use(
  express.static(path.join(__dirname, ".."), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Route mặc định: Truy cập "/" sẽ trả về frontend/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API: Lấy tất cả dữ liệu trong bảng vehicle
app.get("/vehicles", (req, res) => {
  const sql =
    "SELECT id, motobike, car, bus, truck, timestamp FROM vehicle ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API: Thêm dữ liệu mới vào bảng vehicle
app.post("/vehicles", (req, res) => {
  const { motobike, car, bus, truck } = req.body;
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " "); // Định dạng YYYY-MM-DD HH:mm:ss
  const sql =
    "INSERT INTO vehicle (motobike, car, bus, truck, timestamp) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [motobike, car, bus, truck, timestamp], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, motobike, car, bus, truck, timestamp });
  });
});

// Khởi động server
app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});
