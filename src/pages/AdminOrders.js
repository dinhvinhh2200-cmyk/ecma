// src/pages/AdminOrders.js
import { getOrders, updateOrderStatus } from "../api/adminApi";
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

const getStatusClass = (status) => {
    switch (status) {
        case 'Completed': return 'status-completed';
        case 'Processing': return 'status-processing';
        case 'Cancelled': return 'status-cancelled';
        default: return 'status-pending';
    }
}

let currentOrders = [];

const attachAdminOrderEvents = () => {
    // Sự kiện thay đổi trạng thái
    document.querySelector('#order-table-body')?.addEventListener('change', async (e) => {
        if (e.target.classList.contains('status-select')) {
            const orderId = e.target.dataset.id;
            const newStatus = e.target.value;

            if (confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${orderId.substring(0, 8)}... thành "${newStatus}"?`)) {
                const success = await updateOrderStatus(orderId, newStatus);
                if (success) {
                    await loadOrdersAndRender(); // Tải lại dữ liệu để cập nhật trạng thái hiển thị
                    alert(`Cập nhật trạng thái đơn hàng ${orderId.substring(0, 8)}... thành công!`);
                } else {
                    alert('Cập nhật trạng thái thất bại.');
                }
            } else {
                 // Nếu hủy, đặt lại giá trị selection về trạng thái cũ
                 const oldStatus = currentOrders.find(o => o.id === orderId)?.status || 'Pending';
                 e.target.value = oldStatus;
            }
        }
    });
    
    // Sự kiện điều hướng quay lại
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
                    <span class="status-label ${getStatusClass(order.status)}">${order.status}</span>
                </td>
                <td>
                    <select class="status-select" data-id="${order.id}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
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
            <h1>📦 Quản Lý Đơn Hàng</h1>
            
            <table class="admin-table order-table">
                <thead>
                    <tr>
                        <th>ID Đơn Hàng</th>
                        <th>Ngày Tạo</th>
                        <th>Tổng Tiền</th>
                        <th>Trạng Thái</th>
                        <th>Cập Nhật Trạng Thái</th>
                        <th>Chi tiết Sản phẩm</th>
                    </tr>
                </thead>
                <tbody id="order-table-body">
                    </tbody>
            </table>
        </div>
        <style>
        .main-header { display: none !important; }
        </style>
    `;
};