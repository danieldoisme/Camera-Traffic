-- Tạo database
CREATE DATABASE cameratraffic;

-- Chuyển sang database vừa tạo
USE cameratraffic;

-- Tạo bảng vehicle
CREATE TABLE vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID tự tăng làm khóa chính
    motorbike INT DEFAULT 0,            -- Số lượng xe máy
    car INT DEFAULT 0,                 -- Số lượng ô tô
    bus INT DEFAULT 0,                 -- Số lượng xe buýt
    truck INT DEFAULT 0                -- Số lượng xe tải
);