// src/router.js

import { ProductsPage } from "./pages/ProductsPage";
import { CartPage, attachCartEvents } from "./pages/CartPage"; 
import { renderHeader } from "./components/header"; 
import { ThankYouPage } from "./pages/ThankYouPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminOrders } from "./pages/AdminOrders"; 

// FIX: Thêm các component tạm thời cho trang CRUD chưa triển khai
const AdminProductsPage = async () => {
    return `
        <div class="admin-container" style="text-align: center; padding: 50px;">
            <h1>🚧 Quản Lý Sản Phẩm</h1>
            <p style="font-size: 1.2em; color: #e91e63;">Chức năng CRUD Sản phẩm chưa được triển khai giao diện.</p>
            <a href="/admin" class="admin-link spa-link" style="margin-top: 20px; display: inline-block;">← Quay lại Bảng điều khiển</a>
        </div>
        <style>.main-header { display: none !important; }</style>
    `;
};

const AdminCategoriesPage = async () => {
    return `
        <div class="admin-container" style="text-align: center; padding: 50px;">
            <h1>🏷️ Quản Lý Danh Mục</h1>
            <p style="font-size: 1.2em; color: #e91e63;">Chức năng CRUD Danh mục chưa được triển khai giao diện.</p>
            <a href="/admin" class="admin-link spa-link" style="margin-top: 20px; display: inline-block;">← Quay lại Bảng điều khiển</a>
        </div>
        <style>.main-header { display: none !important; }</style>
    `;
};


const routes = {
  "/": ProductsPage, 
  "/cart": CartPage, 
  "/thankyou": ThankYouPage,
  "/admin": AdminDashboard,
  "/admin/orders": AdminOrders,
  // FIX: Thêm các route CRUD mới vào đây
  "/admin/products": AdminProductsPage,
  "/admin/categories": AdminCategoriesPage,
};

// ... (các hàm router, window.addEventListener, navigateTo giữ nguyên)

// Hàm chính xử lý định tuyến
export  const router = async () => {
  const path = window.location.pathname; 
  const component = routes[path] || ProductsPage; // Logic này bây giờ sẽ tìm thấy AdminProductsPage/AdminCategoriesPage
  
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

// Tạo hàm điều hướng (navigation) để chuyển đổi giữa các trang
export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router(); 
}