// src/router.js

import { ProductsPage } from "./pages/ProductsPage";
//  BẮT BUỘC: Import CartPage VÀ attachCartEvents
import { CartPage, attachCartEvents } from "./pages/CartPage"; 
import { renderHeader } from "./components/header"; // Cần import để đảm bảo renderHeader chạy được

const routes = {
  "/": ProductsPage, // Đường dẫn gốc hiển thị trang sản phẩm
  "/cart": CartPage, // Đường dẫn trang giỏ hàng
  // ... thêm các routes khác
};

// Hàm chính xử lý định tuyến
export  const router = async () => {
  const path = window.location.pathname; 
  const component = routes[path] || ProductsPage; 
  
  const appContainer = document.getElementById("app");
  if (appContainer) {
    // appContainer.innerHTML = '<h1>Đang tải...</h1>'; 
    
    // 1. Đảm bảo header được render (nếu chưa có)
    await renderHeader(); 

    // 2. Gọi hàm render component
    const content = await component(); 
    
    // 3. Cập nhật nội dung chính của trang
    appContainer.innerHTML = content;
    
    //  KHẮC PHỤC LỖI: Gọi hàm gắn sự kiện chỉ khi ở trang giỏ hàng
    if (path === '/cart') {
        attachCartEvents();
    }
  }
}

// Lắng nghe sự kiện khi URL thay đổi
window.addEventListener('popstate', router); 

// Chạy router lần đầu khi tải trang
document.addEventListener('DOMContentLoaded', router);

// Tạo hàm điều hướng (navigation) để chuyển đổi giữa các trang
export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router(); 
}