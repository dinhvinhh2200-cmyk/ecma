// src/pages/AdminStats.js
import { getStats } from "../api/adminApi";
import { navigateTo } from "../router";

// Hàm format giá tiền
const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return price;
    return numPrice.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    });
}

const attachAdminStatsEvents = () => {
    // Sự kiện điều hướng quay lại
    document.querySelector('#back-to-admin')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/admin');
    });

    // Tải và hiển thị thống kê
    loadStatsAndRender();
};

const loadStatsAndRender = async () => {
    const stats = await getStats();
    
    document.querySelector('#total-products-sold').textContent = stats.totalProductsSold.toLocaleString('vi-VN');
    document.querySelector('#total-revenue').textContent = formatPrice(stats.totalRevenue);
}

export const AdminStats = async () => {
    // Chờ DOM load xong để gắn sự kiện
    setTimeout(attachAdminStatsEvents, 0); 

    // Giao diện thống kê
    return `
        <div class="admin-container">
            <a href="/admin" class="back-link" id="back-to-admin">← Quay lại Bảng điều khiển</a>
            <span style="margin-left: 20px;">
                <a href="/" class="back-link spa-link">← Quay lại Trang Client</a>
            </span>
            <h1>📈 Thống Kê</h1>
            
            <div class="stats-grid">
                
                <div class="stats-card">
                    <h2>Tổng Số Lượng Sản Phẩm Đã Bán (Đơn mới tạo)</h2>
                    <p class="stat-value" id="total-products-sold">Đang tải...</p>
                </div>
                
                <div class="stats-card">
                    <h2>Tổng Doanh Thu (Đơn mới tạo)</h2>
                    <p class="stat-value revenue" id="total-revenue">Đang tải...</p>
                </div>

            </div>
            <p class="note">Lưu ý: Thống kê chỉ tính các đơn hàng có trạng thái là "Deleted" (Đơn hàng mới tạo).</p>
        </div>
        <style>
        .main-header { display: none !important; }
        </style>
    `;
};