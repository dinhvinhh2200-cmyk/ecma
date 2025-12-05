// src/router.js

import { ProductsPage } from "./pages/ProductsPage";
import { CartPage, attachCartEvents } from "./pages/CartPage"; 
import { renderHeader } from "./components/header"; 
import { ThankYouPage } from "./pages/ThankYouPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminOrders } from "./pages/AdminOrders"; 

const routes = {
  "/": ProductsPage, 
  "/cart": CartPage, 
  "/thankyou": ThankYouPage,
  "/admin": AdminDashboard,
  "/admin/orders": AdminOrders,
};

// Hàm chính xử lý định tuyến
export  const router = async () => {
  const path = window.location.pathname; 
  const component = routes[path] || ProductsPage; 
  
  const appContainer = document.getElementById("app");
  const header = document.querySelector('.main-header'); // Lấy tham chiếu đến header

  if (appContainer) {
    
    // Logic ẩn/hiện header client
    if (!path.startsWith('/admin')) {
      // Nếu không phải trang admin: đảm bảo header hiển thị
      if (header) {
        header.style.display = 'flex'; 
      }
    } else {
        // Nếu là trang admin: ẩn header client
        if (header) {
            header.style.display = 'none'; 
        }
    }
    

    // Gọi hàm render component
    const content = await component(); 
    
    // Cập nhật nội dung chính của trang
    appContainer.innerHTML = content;
    
    // Gắn sự kiện đặc biệt cho từng trang
    if (path === '/cart') {
        attachCartEvents();
    }
  }
}

// Lắng nghe sự kiện khi URL thay đổi
window.addEventListener('popstate', router); 

// FIX: Bỏ khối document.addEventListener('DOMContentLoaded', router) ở đây
// để tránh xung đột với main.js.

// Tạo hàm điều hướng (navigation) để chuyển đổi giữa các trang
export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router(); 
}