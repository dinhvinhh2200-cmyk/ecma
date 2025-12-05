// src/main.js

import { renderHeader } from './components/header';
import { router } from './router'; 

// Gắn sự kiện tải DOM (Đảm bảo chỉ chạy 1 lần khi trang tải)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Header (thành phần tĩnh, chỉ chạy 1 lần)
    renderHeader(); 
    
    // 2. Chạy Router để tải nội dung trang đầu tiên
    router();
});