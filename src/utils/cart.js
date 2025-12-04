// src/utils/cart.js
// Vui lòng kiểm tra lại code này từ câu trả lời trước và đảm bảo bạn đã tạo file này.

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