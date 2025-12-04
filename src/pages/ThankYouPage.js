// src/pages/ThankYouPage.js

import { navigateTo } from "../router";

export const ThankYouPage = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    // Chèn hàm navigateTo vào global scope để nút "Xem lại Giỏ hàng" hoạt động
    if (typeof window.navigateTo === 'undefined') {
        window.navigateTo = navigateTo;
    }
    
    return `
        <div class="admin-container" style="text-align: center; padding: 50px;">
            <h1>🎉 Cảm Ơn Bạn Đã Đặt Hàng!</h1>
            <p style="font-size: 1.1em; margin-bottom: 20px;">Đơn hàng của bạn đã được ghi nhận thành công.</p>
            ${orderId ? `<p>Mã đơn hàng của bạn là: <strong>${orderId.substring(0, 8)}...</strong></p>` : ''}
            <div style="margin-top: 30px;">
                <a href="/" class="admin-link spa-link" style="background-color: #0d47a1; padding: 10px 20px; border-radius: 4px; color: white;">Tiếp tục mua sắm</a>
                <span style="margin: 0 10px;">hoặc</span>
                <button class="admin-link" onclick="window.navigateTo('/cart')" style="background-color: #ff9800; border: none; padding: 10px 20px; border-radius: 4px; color: white; cursor: pointer;">Xem lại Giỏ hàng</button>
            </div>
        </div>
    `;
}