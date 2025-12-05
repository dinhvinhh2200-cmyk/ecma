// src/main.js

import { renderHeader } from './components/header';
import { router } from './router'; 
import './styles/main.css';
import './styles/admin.css';

// Khởi tạo ứng dụng sau khi DOM đã được tải
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Header (thành phần tĩnh, chỉ chạy 1 lần)
    renderHeader(); 
    
    // 2. Chạy Router để tải nội dung trang đầu tiên
    router();
});