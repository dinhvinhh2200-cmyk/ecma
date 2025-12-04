// src/pages/CartPage.js

import { getCart, updateQuantity, removeItem, placeOrder } from "../utils/cart"; 
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

/**
 * ⭐️ BẮT BUỘC: Gắn các sự kiện tương tác cho trang giỏ hàng
 */
export const attachCartEvents = () => { 
    const cartTableBody = document.querySelector('.cart-table-body');
    if (!cartTableBody) return; 

    // 1. Sự kiện thay đổi số lượng (dùng event delegation trên body của table)
    cartTableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.dataset.id;
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity <= 0 || isNaN(newQuantity)) {
                if (confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                    removeItem(productId);
                    navigateTo('/cart'); 
                } else {
                    const cart = getCart();
                    const item = cart.find(i => i.id === productId);
                    e.target.value = item ? item.quantity : 1; 
                }
            } else {
                updateQuantity(productId, newQuantity);
                navigateTo('/cart'); // Tải lại trang để cập nhật tổng tiền
            }
        }
    });

    // 2. Sự kiện xóa sản phẩm
    cartTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const productId = e.target.dataset.id;
            if (confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                removeItem(productId);
                navigateTo('/cart'); 
            }
        }
    });

    // 3. Sự kiện Thanh toán ⭐️ ĐÃ SỬA: KHÔNG CÓ CHUYỂN HƯỚNG
    document.querySelector('.checkout-btn')?.addEventListener('click', async () => {
        const cart = getCart();
        const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

        if (cart.length === 0) {
            alert('Giỏ hàng trống. Không thể thanh toán.');
            return;
        }

        const isSuccess = await placeOrder(cart, cartTotal);
        if (isSuccess) {
            alert('Thanh toán thành công! Đơn hàng đã được ghi nhận.');
            // ⭐️ ĐÃ XÓA CHUYỂN HƯỚNG: Giữ nguyên trên trang giỏ hàng (sẽ render lại rỗng)
            navigateTo('/cart'); 
        } else {
            alert('Có lỗi xảy ra trong quá trình đặt hàng.');
        }
    });
};


/**
 * Hàm render trang giỏ hàng chính
 */
export const CartPage = () => {
    const cart = getCart();
    
    // ... (logic render cart items)
    const cartItemsHtml = cart.map(item => {
        const priceNumber = Number(item.price);
        const totalPrice = priceNumber * item.quantity;
        return `
            <tr data-id="${item.id}">
                <td class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <span>${item.name}</span>
                </td>
                <td>${formatPrice(priceNumber)}</td>
                <td>
                    <input 
                        type="number" 
                        class="quantity-input" 
                        value="${item.quantity}" 
                        min="1" 
                        data-id="${item.id}"
                    >
                </td>
                <td>${formatPrice(totalPrice)}</td>
                <td>
                    <button class="remove-item-btn" data-id="${item.id}">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
    
    const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    
    if (cart.length === 0) {
        return `
            <div class="cart-container">
                <h2>🛒 Giỏ hàng của bạn</h2>
                <p>Giỏ hàng trống. Vui lòng quay lại <a href="/" class="spa-link">trang sản phẩm</a> để mua sắm.</p>
            </div>
        `;
    }

    // Trả về toàn bộ nội dung trang
    return `
        <div class="cart-container">
            <h2>🛒 Giỏ hàng của bạn</h2>
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
                <tbody class="cart-table-body">
                    ${cartItemsHtml}
                </tbody>
            </table>
            <div class="cart-summary">
                <p class="cart-total">Tổng cộng: <span>${formatPrice(cartTotal)}</span></p>
                <button class="checkout-btn">Tiến hành thanh toán</button>
            </div>
        </div>
    `;
};