// src/main.js import router.js 
import './router.js'; 

// src/main.js

import { renderHeader } from './components/header';
import { router } from './router'; 

// Gắn sự kiện tải DOM (đã có trong router.js) và gọi các hàm khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Header (thành phần tĩnh, chỉ chạy 1 lần)
    renderHeader(); 
    
    // 2. Chạy Router để tải nội dung trang đầu tiên (ví dụ: ProductsPage)
    // Lưu ý: Hàm router() đã được gọi ở cuối file router.js, 
    // nhưng việc gọi lại ở đây hoặc đảm bảo nó chạy sau renderHeader là cần thiết.
    // Nếu bạn muốn giữ logic khởi tạo chính ở đây, bạn có thể gọi router() tại đây.
    // router(); // (BỎ COMMENT NẾU BẠN LOẠI BỎ document.addEventListener từ router.js)
});


// Lưu ý: Nếu bạn giữ nguyên: 
// document.addEventListener('DOMContentLoaded', router);
// ở cuối file router.js, bạn chỉ cần đảm bảo main.js chạy (và nó có import router)
// và gọi renderHeader() ở đây.