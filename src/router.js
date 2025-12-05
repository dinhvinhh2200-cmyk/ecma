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
        header.style.display = 'flex'; // FIX: Hiện header
      }
      // Khong can gọi renderHeader() ở đây nữa vì nó đã được gọi trong main.js
      // và có logic tự kiểm tra.
    } else {
        // Nếu là trang admin: ẩn header client
        if (header) {
            header.style.display = 'none'; // FIX: Ẩn header
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

// FIX: Loại bỏ document.addEventListener('DOMContentLoaded', router) ở đây
// để tránh việc router() chạy hai lần (một lần ở đây, một lần ở main.js sau khi renderHeader()).
// Thay vào đó, chúng ta sẽ gọi router() trực tiếp trong DOMContentLoaded ở main.js, 
// hoặc đơn giản là gọi nó ở đây:

document.addEventListener('DOMContentLoaded', () => {
    // FIX: Đảm bảo router được gọi sau khi DOM đã sẵn sàng
    router();
});


// Tạo hàm điều hướng (navigation) để chuyển đổi giữa các trang
export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router(); 
}