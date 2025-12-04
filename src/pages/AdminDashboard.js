// src/pages/AdminDashboard.js
import { navigateTo } from "../router";

/**
 * Gắn sự kiện điều hướng trong trang Admin
 */
const attachAdminDashboardEvents = () => {
    document.querySelectorAll('.admin-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href');
            navigateTo(href);
        });
    });
};

// Hàm render trang tổng quan Admin
export const AdminDashboard = async () => {
    
    setTimeout(attachAdminDashboardEvents, 0);

    return `
        <div class="admin-container">
            <h1>📊 Trang Quản Trị</h1>
            <div class="admin-grid">
                
                <div class="admin-card">
                    <h2>Quản Lý Danh Mục</h2>
                    <p>Thêm, sửa, xóa các danh mục sản phẩm.</p>
                    <a href="/admin/categories" class="admin-link">Đến trang quản lý</a>
                </div>

                <div class="admin-card">
                    <h2>Quản Lý Đơn Hàng</h2>
                    <p>Xem và cập nhật trạng thái đơn hàng.</p>
                    <a href="/admin/orders" class="admin-link">Đến trang quản lý</a>
                </div>

                <div class="admin-card">
                    <h2>Thống Kê</h2>
                    <p>Xem thống kê số lượng đặt hàng và doanh thu.</p>
                    <a href="/admin/stats" class="admin-link">Đến trang thống kê</a>
                </div>

            </div>
        </div>
        <style>
        .main-header { display: none !important; } /* Ẩn header chính trong khu vực Admin */
        </style>
    `;
};