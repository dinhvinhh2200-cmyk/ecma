// src/pages/AdminOrders.js
import { getOrders, deleteOrder } from "../api/adminApi"; // Chỉ import getOrders và deleteOrder
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

const formatDate = (date) => {
    // Định dạng ngày/tháng/năm
    return date instanceof Date ? date.toLocaleDateString('vi-VN') : 'N/A';
}

let currentOrders = [];

const attachAdminOrderEvents = () => {
    
    // Chỉ giữ lại sự kiện Xóa đơn hàng
    document.querySelector('#order-table-body')?.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-order-btn')) {
            const orderId = e.target.dataset.id;
            
            if (confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN đơn hàng ${orderId.substring(0, 8)}...?`)) {
                const success = await deleteOrder(orderId);
                if (success) {
                    await loadOrdersAndRender(); // Tải lại dữ liệu
                    alert(`Đã xóa đơn hàng ${orderId.substring(0, 8)}... thành công!`);
                } else {
                    alert('Xóa đơn hàng thất bại.');
                }
            }
        }
    });
    
    // Sự kiện điều hướng quay lại Admin Dashboard
    document.querySelector('#back-to-admin')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/admin');
    });

    // Tải và render lần đầu
    loadOrdersAndRender();
};

const renderOrderItems = (items) => {
    if (!Array.isArray(items)) return 'N/A';
    return items.map(item => `${item.name} (SL: ${item.quantity})`).join('<br>');
}

const loadOrdersAndRender = async () => {
    currentOrders = await getOrders();
    const tableBody = document.querySelector('#order-table-body');
    if (tableBody) {
        tableBody.innerHTML = currentOrders.map(order => `
            <tr>
                <td>${order.id.substring(0, 8)}...</td>
                <td>${formatDate(order.createdAt)}</td>
                <td>${formatPrice(order.totalPrice)}</td>
                <td>
                    <span class="status-label status-deleted">${order.status}</span>
                </td>
                <td>
                    <button class="delete-order-btn admin-button delete" data-id="${order.id}">Xóa Đơn Hàng</button>
                </td>
                <td class="order-items-detail">
                    ${renderOrderItems(order.items)}
                </td>
            </tr>
        `).join('');
    }
}


export const AdminOrders = async () => {
    // Chờ DOM load xong để gắn sự kiện
    setTimeout(attachAdminOrderEvents, 0); 

    // Giao diện quản lý đơn hàng
    return `
        <div class="admin-container">
            <a href="/admin" class="back-link" id="back-to-admin">← Quay lại Bảng điều khiển</a>
            <span style="margin-left: 20px;">
                <a href="/" class="back-link spa-link">← Quay lại Trang Client</a>
            </span>
            <h1>📦 Quản Lý Đơn Hàng (Chỉ có chức năng XÓA)</h1>
            
            <table class="admin-table order-table">
                <thead>
                    <tr>
                        <th>ID Đơn Hàng</th>
                        <th>Ngày Tạo</th>
                        <th>Tổng Tiền</th>
                        <th>Trạng Thái</th>
                        <th>Thao Tác</th>
                        <th>Chi tiết Sản phẩm</th>
                    </tr>
                </thead>
                <tbody id="order-table-body">
                    </tbody>
            </table>
        </div>
        <style>
        .main-header { display: none !important; }
        /* Thêm style để hiển thị trạng thái Deleted */
        .status-deleted { background-color: #ff9800; color: white; }
        </style>
    `;
};