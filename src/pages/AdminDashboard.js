// src/pages/AdminDashboard.js

import { getStats } from "../api/adminApi"; 
import { navigateTo } from "../router";

// Hàm format giá tiền
const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '0 đ';
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

/**
 * Hàm render thống kê
 */
const renderStats = async () => {
    const statsContainer = document.querySelector('#stats-container');
    if (!statsContainer) return;

    try {
        const stats = await getStats();
        const { totalRevenue, totalProductsSold } = stats;

        statsContainer.innerHTML = `
            <div class="stats-card">
                <h2>📊 Tổng Doanh Thu</h2>
                <div class="stat-value revenue">${formatPrice(totalRevenue)}</div>
            </div>
            <div class="stats-card">
                <h2>📦 Tổng Sản Phẩm Đã Bán</h2>
                <div class="stat-value">${totalProductsSold.toLocaleString('vi-VN')}</div>
            </div>
        `;
    } catch (error) {
        statsContainer.innerHTML = '<p class="note">Lỗi tải dữ liệu thống kê.</p>';
        console.error("Lỗi tải stats:", error);
    }
}


/**
 * Gắn sự kiện cho các link Admin (nếu cần)
 */
const attachAdminDashboardEvents = () => {
    // 1. Gắn sự kiện điều hướng SPA cho tất cả các link admin
    document.querySelectorAll('.admin-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                e.preventDefault();
                navigateTo(href);
            }
        });
    });

    // 2. Tải và render thống kê
    renderStats();
};


export const AdminDashboard = async () => {
    
    // Gắn sự kiện sau khi DOM được cập nhật
    setTimeout(attachAdminDashboardEvents, 0);

    return `
        <div class="admin-container">
            <a href="/" class="back-link spa-link">← Quay lại Trang Client</a>
            <h1>🛠️ Bảng Điều Khiển Quản Trị</h1>

            <h2>Thống Kê Cơ Bản</h2>
            <div class="stats-grid" id="stats-container">
                <p>Đang tải thống kê...</p>
            </div>
            <p class="note">Lưu ý: Doanh thu hiện đang được tính dựa trên đơn hàng có trạng thái 'Completed' (Hoàn thành).</p>


            <h2 style="margin-top: 40px;">Quản Lý Nội Dung</h2>
            <div class="admin-grid">
                
                <div class="admin-card">
                    <h2>Quản Lý Sản Phẩm</h2>
                    <p>Thêm, sửa, xóa sản phẩm (Chưa triển khai giao diện).</p>
                    <a href="/admin/products" class="admin-link">Quản Lý SP</a>
                </div>

                <div class="admin-card">
                    <h2>Quản Lý Danh Mục</h2>
                    <p>Thêm, sửa, xóa danh mục sản phẩm (Chưa triển khai giao diện).</p>
                    <a href="/admin/categories" class="admin-link">Quản Lý Danh Mục</a>
                </div>
                
                <div class="admin-card">
                    <h2>Quản Lý Đơn Hàng</h2>
                    <p>Xem danh sách, xóa (và cập nhật trạng thái) đơn hàng.</p>
                    <a href="/admin/orders" class="admin-link">Xem Đơn Hàng</a>
                </div>
                
            </div>
        </div>
        <style>
        .main-header { display: none !important; }
        </style>
    `;
};