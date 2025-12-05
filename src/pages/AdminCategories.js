// src/pages/AdminCategories.js

import { getCategories } from "../api/categoriesApi"; 
import { addCategory, updateCategory, deleteCategory } from "../api/adminApi"; 
import { navigateTo } from "../router";

let currentCategories = [];
let editingCategoryId = null;

const renderCategoryList = async () => {
    const tableBody = document.querySelector('#category-table-body');
    if (!tableBody) return;

    try {
        currentCategories = await getCategories();
    } catch (e) {
        console.error("Lỗi tải danh mục:", e);
        tableBody.innerHTML = '<tr><td colspan="3">Không thể tải dữ liệu danh mục.</td></tr>';
        return;
    }

    const categoryHtml = currentCategories.map(cat => `
        <tr>
            <td>${cat.id.substring(0, 8)}...</td>
            <td>${cat.name}</td>
            <td>
                <button class="admin-button secondary edit-category-btn" data-id="${cat.id}" data-name="${cat.name}">Sửa</button>
                <button class="admin-button delete delete-category-btn" data-id="${cat.id}">Xóa</button>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = categoryHtml;
    updateFormState(null);
}

const updateFormState = (category = null) => {
    const form = document.querySelector('#category-form');
    const nameInput = document.querySelector('#category-name');
    const formTitle = document.querySelector('#category-form-title');
    
    if (category) {
        editingCategoryId = category.id;
        nameInput.value = category.name;
        formTitle.textContent = "Cập Nhật Danh Mục";
        document.querySelector('#cancel-edit-btn').style.display = 'inline-block';
    } else {
        editingCategoryId = null;
        nameInput.value = '';
        formTitle.textContent = "Thêm Danh Mục Mới";
        document.querySelector('#cancel-edit-btn').style.display = 'none';
    }
}

const attachCategoryEvents = () => {
    
    // Sự kiện Gửi Form (Thêm/Sửa)
    document.querySelector('#category-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.querySelector('#category-name');
        const categoryName = nameInput.value.trim();

        if (!categoryName) {
            alert('Tên danh mục không được để trống.');
            return;
        }

        const categoryData = { name: categoryName };
        let success;

        if (editingCategoryId) {
            // Cập nhật
            success = await updateCategory(editingCategoryId, categoryData);
        } else {
            // Thêm mới
            success = await addCategory(categoryData);
        }

        if (success) {
            await renderCategoryList();
        }
    });

    // Sự kiện Sửa/Xóa
    document.querySelector('#category-table-body')?.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-category-btn')) {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            updateFormState({ id, name });
        } 
        else if (e.target.classList.contains('delete-category-btn')) {
            const id = e.target.dataset.id;
            if (confirm(`Thao tác này sẽ xóa danh mục và loại bỏ ràng buộc của nó khỏi các sản phẩm. Bạn có chắc chắn muốn xóa danh mục ${id.substring(0, 8)}...?`)) {
                const success = await deleteCategory(id);
                if (success) {
                    await renderCategoryList();
                }
            }
        }
    });
    
    // Sự kiện Hủy cập nhật
    document.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
        updateFormState(null);
    });
    
    // Sự kiện điều hướng (Quay lại)
    document.querySelector('#back-to-admin')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/admin');
    });

    // Tải và render lần đầu
    renderCategoryList();
};


export const AdminCategories = async () => {
    // Chờ DOM load xong để gắn sự kiện
    setTimeout(attachCategoryEvents, 0); 

    // Giao diện quản lý danh mục
    return `
        <div class="admin-container">
            <a href="/admin" class="back-link" id="back-to-admin">← Quay lại Bảng điều khiển</a>
            <h1>🏷️ Quản Lý Danh Mục Sản Phẩm</h1>
            
            <div class="crud-layout">
                <div class="crud-form">
                    <h2 id="category-form-title">Thêm Danh Mục Mới</h2>
                    <form id="category-form">
                        <input type="text" id="category-name" placeholder="Tên danh mục..." required class="admin-input" />
                        <button type="submit" class="admin-button primary">Lưu Danh Mục</button>
                        <button type="button" id="cancel-edit-btn" class="admin-button secondary" style="display:none;">Hủy</button>
                    </form>
                </div>

                <div class="crud-table">
                    <h2>Danh Sách Danh Mục</h2>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Danh Mục</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody id="category-table-body">
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
        <style>
            .main-header { display: none !important; }
            .crud-layout { display: flex; gap: 30px; margin-top: 20px; }
            .crud-form { flex: 0 0 300px; padding: 20px; border: 1px solid #ddd; border-radius: 4px; height: fit-content;}
            .crud-table { flex-grow: 1; }
            .admin-input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        </style>
    `;
};