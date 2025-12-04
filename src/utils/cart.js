// src/utils/cart.js
// Vui lòng kiểm tra lại code này từ câu trả lời trước và đảm bảo bạn đã tạo file này.

// ⭐️ IMPORT THÊM CHO CHỨC NĂNG ĐẶT HÀNG
import { db } from "../firebase/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { navigateTo } from "../router"; 

const CART_STORAGE_KEY = 'shopping_cart';

export const getCart = () => {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
};

const saveCart = (cart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const updateCartCount = () => {
    const cart = getCart();
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
};

export const addToCart = (product) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: 1 
        });
    }

    saveCart(cart);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    updateCartCount(); 
};

export const updateQuantity = (productId, newQuantity) => {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity > 0 ? newQuantity : 1;
    }
    saveCart(cart);
    updateCartCount();
    return true; 
};

export const removeItem = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    return true;
};

// ⭐️ ĐÃ CHỈNH SỬA: Đơn hàng mới luôn có status: 'Deleted'
export const placeOrder = async (cart, total) => {
    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return false;
    }
    
    try {
        const orderData = {
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalPrice: total,
            status: 'Deleted', // Trạng thái là 'Deleted' theo yêu cầu
            createdAt: serverTimestamp() 
        };

        await addDoc(collection(db, "orders"), orderData);
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem(CART_STORAGE_KEY);
        updateCartCount();
        
        return true;
    } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        alert("Đặt hàng thất bại. Vui lòng kiểm tra console.");
        return false;
    }
};