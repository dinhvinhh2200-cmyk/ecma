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
            <a href="/" class="back-link spa-link" style="margin-bottom: 20px; display: inline-block;">
                ← Quay lại Trang Client
            </a>
            <h1>📊 Trang Quản Trị</h1>
            <div class="admin-grid">
                
                <div class="admin-card">
                    <h2>Quản Lý Danh Mục</h2>
                    <p>Thêm, sửa, xóa các danh mục sản phẩm (Không cần ràng buộc sản phẩm).</p>
                    <a href="/admin/categories" class="admin-link">Đến trang quản lý</a>
                </div>

                <div class="admin-card">
                    <h2>Quản Lý Đơn Hàng</h2>
                    <p>Xem và XÓA đơn hàng (Chỉ có chức năng xóa).</p>
                    <a href="/admin/orders" class="admin-link">Đến trang quản lý</a>
                </div>

                <div class="admin-card">
                    <h2>Thống Kê</h2>
                    <p>Xem thống kê Doanh thu từ đơn hàng mới tạo (status: Deleted).</p>
                    <a href="/admin/stats" class="admin-link">Đến trang thống kê</a>
                </div>

            </div>
        </div>
        <style>
        .main-header { display: none !important; } /* Ẩn header chính trong khu vực Admin */
        </style>
    `;
};