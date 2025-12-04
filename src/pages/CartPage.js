// src/pages/CartPage.js

import { getCart, removeItem, updateQuantity, clearCart } from "../utils/cart";
import { addOrder } from "../api/adminApi"; 
import { navigateTo } from "../router";

// Hàm format giá tiền
const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return price;
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

/**
 * Gắn các sự kiện: Xóa item, Cập nhật số lượng, Thanh toán
 */
export const attachCartEvents = () => {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    // 1. Cập nhật số lượng và Xóa sản phẩm
    cartContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.dataset.id;
            const newQuantity = Number(e.target.value);
            updateQuantity(productId, newQuantity);
            // Tải lại nội dung để cập nhật tổng tiền
            renderCartContent();
        }
    });

    cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const productId = e.target.dataset.id;
            removeItem(productId);
            // Tải lại nội dung giỏ hàng
            renderCartContent();
        }

        // 2. Xử lý nút Thanh toán
        if (e.target.id === 'checkout-btn') {
            e.preventDefault();
            handleCheckout();
        }
    });

    // Tải và render nội dung giỏ hàng lần đầu
    renderCartContent();
}

const renderCartContent = () => {
    const cart = getCart();
    const cartTableBody = document.querySelector('#cart-table-body');
    const cartSummary = document.querySelector('#cart-summary');

    if (!cartTableBody || !cartSummary) return;

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">Giỏ hàng của bạn đang trống. <a href="/" class="spa-link">Quay lại trang sản phẩm</a>.</td></tr>';
        cartSummary.innerHTML = '';
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartHtml = cart.map(item => `
        <tr>
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <input type="number" data-id="${item.id}" class="quantity-input" min="1" value="${item.quantity}">
            </td>
            <td>${formatPrice(item.price * item.quantity)}</td>
            <td>
                <button data-id="${item.id}" class="remove-item-btn remove-item-btn">Xóa</button>
            </td>
        </tr>
    `).join('');

    const summaryHtml = `
        <div class="cart-total">Tổng tiền: <span>${formatPrice(total)}</span></div>
        <button id="checkout-btn" class="checkout-btn">Đặt hàng</button>
    `;

    cartTableBody.innerHTML = cartHtml;
    cartSummary.innerHTML = summaryHtml;

    // Gán lại sự kiện SPA cho các link sau khi render
    document.querySelectorAll('.spa-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        });
    });
}

const handleCheckout = async () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Giỏ hàng trống, không thể đặt hàng.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
        items: cart,
        totalPrice: total,
        customerName: "Khách hàng " + new Date().getTime(), // Đơn giản hóa
        status: "Pending", // Trạng thái đơn hàng mới
    };

    try {
        const orderId = await addOrder(orderData); // Gọi API thêm đơn hàng
        if (orderId) {
            clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
            navigateTo(`/thankyou?orderId=${orderId}`); // Chuyển đến trang cảm ơn
        }
    } catch (error) {
        alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        console.error("Lỗi đặt hàng:", error);
    }
}

// Hàm render giao diện Cart
export const CartPage = async () => {
    return `
        <div class="cart-container">
            <h2>🛒 Giỏ Hàng Của Bạn</h2>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="cart-table-body">
                    </tbody>
            </table>
            <div class="cart-summary" id="cart-summary">
                </div>
        </div>
    `;
};