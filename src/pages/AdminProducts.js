// src/pages/AdminProducts.js

import { getProducts } from "../api/productsApi"; 
import { getCategories } from "../api/categoriesApi"; 
import { addProduct, updateProduct, deleteProduct } from "../api/adminApi"; 
import { navigateTo } from "../router";

let currentProducts = [];
let availableCategories = [];
let editingProductId = null;

const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return price;
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

const renderProductForm = () => {
    const formContainer = document.querySelector('#product-form-container');
    if (!formContainer) return;
    
    // Tạo option cho select danh mục
    const categoryOptions = availableCategories.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');
    
    // Giao diện form
    formContainer.innerHTML = `
        <h2 id="product-form-title">Thêm Sản Phẩm Mới</h2>
        <form id="product-form" class="product-form">
            <input type="text" id="product-name" placeholder="Tên sản phẩm" required class="admin-input" />
            <input type="number" id="product-price" placeholder="Giá (VND)" required class="admin-input" />
            <input type="text" id="product-image" placeholder="URL hình ảnh" required class="admin-input" />
            <select id="product-category" required class="admin-input">
                <option value="">-- Chọn Danh mục --</option>
                ${categoryOptions}
            </select>
            <button type="submit" class="admin-button primary">Lưu Sản Phẩm</button>
            <button type="button" id="cancel-edit-btn" class="admin-button secondary">Hủy</button>
        </form>
    `;
    updateFormState(null);
}

const renderProductList = async () => {
    const tableBody = document.querySelector('#product-table-body');
    if (!tableBody) return;

    try {
        currentProducts = await getProducts({}); // Lấy tất cả sản phẩm
        availableCategories = await getCategories(); // Lấy tất cả danh mục
    } catch (e) {
        console.error("Lỗi tải sản phẩm/danh mục:", e);
        tableBody.innerHTML = '<tr><td colspan="6">Không thể tải dữ liệu sản phẩm.</td></tr>';
        return;
    }

    const categoryMap = availableCategories.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
    }, {});

    const productHtml = currentProducts.map(prod => `
        <tr>
            <td>${prod.id.substring(0, 8)}...</td>
            <td><img src="${prod.image}" alt="${prod.name}" class="product-thumb"></td>
            <td>${prod.name}</td>
            <td>${formatPrice(prod.price)}</td>
            <td>${categoryMap[prod.cate_id] || 'N/A'}</td>
            <td>
                <button class="admin-button secondary edit-product-btn" data-id="${prod.id}">Sửa</button>
                <button class="admin-button delete delete-product-btn" data-id="${prod.id}">Xóa</button>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = productHtml;
    // Cần render lại form để cập nhật danh mục và trạng thái form
    renderProductForm(); 
}

const updateFormState = (product = null) => {
    const form = document.querySelector('#product-form');
    const formTitle = document.querySelector('#product-form-title');
    const cancelButton = document.querySelector('#cancel-edit-btn');
    
    if (!form) return;

    if (product) {
        editingProductId = product.id;
        form.querySelector('#product-name').value = product.name || '';
        form.querySelector('#product-price').value = product.price || '';
        form.querySelector('#product-image').value = product.image || '';
        form.querySelector('#product-category').value = product.cate_id || '';
        formTitle.textContent = "Cập Nhật Sản Phẩm";
        cancelButton.style.display = 'inline-block';
    } else {
        editingProductId = null;
        form.reset();
        formTitle.textContent = "Thêm Sản Phẩm Mới";
        cancelButton.style.display = 'none';
    }
}

const attachProductEvents = () => {
    
    const formContainer = document.querySelector('#product-form-container');
    const tableBody = document.querySelector('#product-table-body');
    
    // 1. Sự kiện Gửi Form (Thêm/Sửa)
    formContainer?.addEventListener('submit', async (e) => {
        if (e.target.id !== 'product-form') return;
        e.preventDefault();
        
        const productData = {
            name: document.querySelector('#product-name').value.trim(),
            price: document.querySelector('#product-price').value,
            image: document.querySelector('#product-image').value.trim(),
            cate_id: document.querySelector('#product-category').value,
        };

        if (!productData.name || !productData.price || !productData.image || !productData.cate_id) {
            alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
            return;
        }

        let success;
        if (editingProductId) {
            success = await updateProduct(editingProductId, productData);
        } else {
            success = await addProduct(productData);
        }

        if (success) {
            await renderProductList();
        }
    });

    // 2. Sự kiện Sửa/Xóa và Hủy
    document.querySelector('.admin-container')?.addEventListener('click', async (e) => {
        // Edit button
        if (e.target.classList.contains('edit-product-btn')) {
            const id = e.target.dataset.id;
            const product = currentProducts.find(p => p.id === id);
            if (product) {
                updateFormState(product);
                // Cuộn lên đầu để dễ chỉnh sửa
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } 
        // Delete button
        else if (e.target.classList.contains('delete-product-btn')) {
            const id = e.target.dataset.id;
            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${id.substring(0, 8)}...?`)) {
                const success = await deleteProduct(id);
                if (success) {
                    await renderProductList();
                }
            }
        }
        // Cancel button
        else if (e.target.id === 'cancel-edit-btn') {
            updateFormState(null);
        }
    });
    
    // Sự kiện điều hướng (Quay lại)
    document.querySelector('#back-to-admin')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/admin');
    });

    // Tải và render lần đầu
    renderProductList();
};


export const AdminProducts = async () => {
    // Chờ DOM load xong để gắn sự kiện
    setTimeout(attachProductEvents, 0); 

    // Giao diện quản lý sản phẩm
    return `
        <div class="admin-container">
            <a href="/admin" class="back-link" id="back-to-admin">← Quay lại Bảng điều khiển</a>
            <h1>💻 Quản Lý Sản Phẩm</h1>
            
            <div id="product-form-container" class="product-form-area">
                </div>

            <h2 style="margin-top: 30px;">Danh Sách Sản Phẩm</h2>
            <div class="crud-table">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ảnh</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Giá</th>
                            <th>Danh Mục</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody id="product-table-body">
                        </tbody>
                </table>
            </div>
        </div>
        <style>
            .main-header { display: none !important; }
            .product-form-area { padding: 20px; border: 1px solid #ddd; border-radius: 4px; }
            .admin-input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            .product-thumb { width: 60px; height: 60px; object-fit: contain; }
            .product-form button { margin-right: 10px; }
            .crud-table { overflow-x: auto; } /* fix cho bảng lớn */
        </style>
    `;
};