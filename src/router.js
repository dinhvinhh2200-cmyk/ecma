// src/router.js (CẬP NHẬT HOÀN CHỈNH)

import { ProductsPage } from "./pages/ProductsPage";
import { CartPage, attachCartEvents } from "./pages/CartPage"; 
// ⭐️ IMPORT ADMIN COMPONENTS
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminCategories } from "./pages/AdminCategories";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminStats } from "./pages/AdminStats";

import { renderHeader } from "./components/header"; 

const routes = {
  "/": ProductsPage, 
  "/cart": CartPage, 
  // ⭐️ ROUTES ADMIN
  "/admin": AdminDashboard, 
  "/admin/categories": AdminCategories,
  "/admin/orders": AdminOrders,
  "/admin/stats": AdminStats,
  // ... thêm các routes khác
};

// Hàm chính xử lý định tuyến
export  const router = async () => {
  const path = window.location.pathname; 
  const component = routes[path] || ProductsPage; 
  
  const appContainer = document.getElementById("app");
  if (appContainer) {
    // 1. Đảm bảo header được render
    await renderHeader(); 

    // 2. Gọi hàm render component
    const content = await component(); 
    
    // 3. Cập nhật nội dung chính của trang
    appContainer.innerHTML = content;
    
    //  Gắn sự kiện chỉ khi ở trang giỏ hàng
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