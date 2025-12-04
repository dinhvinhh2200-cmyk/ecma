// src/pages/ProductsPage.js

import { getProducts } from "../api/productsApi";
import { addToCart } from "../utils/cart"; 

let productData = []; 

// Hàm format giá tiền
const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return price;
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

/**
 * Gắn sự kiện click cho các nút "Thêm vào giỏ"
 */
const attachProductEvents = () => {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const productToAdd = productData.find(p => p.id === productId);

            if (productToAdd) {
                addToCart(productToAdd); 
            } else {
                console.error("Không tìm thấy sản phẩm với ID:", productId);
            }
        });
    });
}


// Hàm render giao diện sản phẩm
export  const ProductsPage = async () => {
  
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('cate_id'); 
  const searchTerm = urlParams.get('search'); 
    
  let products = [];
  try {
    products = await getProducts({ categoryId, searchTerm });
    productData = products; // LƯU TRỮ DỮ LIỆU
  } catch (error) {
    return `
      <div class="error-message">
        <h1>Lỗi tải dữ liệu</h1>
        <p>Không thể kết nối hoặc lấy dữ liệu sản phẩm. Vui lòng kiểm tra console log.</p>
      </div>
    `;
  }
  
  const productHtml = products.map(product => `
    <div class="product-item">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${formatPrice(product.price)}</p>
      <button data-id="${product.id}" class="add-to-cart-btn">Thêm vào giỏ</button>
    </div>
  `).join('');

  // Gắn sự kiện sau khi DOM được cập nhật
  setTimeout(attachProductEvents, 0); 
  
  return `
    <div class="main-content-area">
        <div class="category-sidebar">
            <h2>Danh mục sản phẩm</h2>
            <ul>
                <li><a href="/" class="spa-link">Tất cả sản phẩm</a></li>
            </ul>
        </div>

        <div class="products-container">
            <h1>${searchTerm ? `Kết quả tìm kiếm cho: "${searchTerm}"` : (categoryId ? 'Sản phẩm theo danh mục' : 'Tất cả Sản phẩm')}</h1>
            <div class="product-list">
                ${productHtml.length > 0 ? productHtml : '<p>Không tìm thấy sản phẩm nào.</p>'}
            </div>
        </div>
    </div>
  `;
}