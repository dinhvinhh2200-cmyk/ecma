// src/pages/AdminCategories.js
import { getCategories } from "../api/categoriesApi"; 
import { addCategory, updateCategory, deleteCategory } from "../api/adminApi";
import { navigateTo } from "../router";

let currentCategories = [];
let editingCategory = null; 

const attachAdminCategoryEvents = () => {
    
    // Gán sự kiện Thêm/Sửa
    const form = document.querySelector('#category-form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.querySelector('#category-name-input');
        const name = nameInput.value.trim();

        if (!name) {
            alert("Tên danh mục không được để trống.");
            return;
        }

        let success = false;
        if (editingCategory) {
            // Sửa
            success = await updateCategory(editingCategory.id, { name });
        } else {
            // Thêm mới
            success = await addCategory({ name });
        }

        if (success) {
            nameInput.value = ''; // Xóa form
            editingCategory = null;
            document.querySelector('#form-title').textContent = 'Thêm Danh Mục Mới';
            document.querySelector('#submit-btn').textContent = 'Thêm';
            await loadCategoriesAndRender(); // Tải lại dữ liệu
        }
    });

    // Gán sự kiện Sửa/Xóa (dùng Event Delegation)
    document.querySelector('#category-table-body')?.addEventListener('click', async (e) => {
        const categoryId = e.target.dataset.id;
        const category = currentCategories.find(c => c.id === categoryId);

        if (e.target.classList.contains('edit-btn')) {
            if (category) {
                editingCategory = category;
                document.querySelector('#category-name-input').value = category.name;
                document.querySelector('#form-title').textContent = `Sửa Danh Mục: ${category.name}`;
                document.querySelector('#submit-btn').textContent = 'Cập Nhật';
            }
        } else if (e.target.classList.contains('delete-btn')) {
            if (category && confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
                const success = await deleteCategory(categoryId);
                if (success) {
                    await loadCategoriesAndRender();
                }
            }
        }
    });
    
    // Gán sự kiện cho nút Hủy
    document.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
        editingCategory = null;
        document.querySelector('#category-name-input').value = '';
        document.querySelector('#form-title').textContent = 'Thêm Danh Mục Mới';
        document.querySelector('#submit-btn').textContent = 'Thêm';
    });
    
    // Sự kiện điều hướng quay lại
    document.querySelector('#back-to-admin')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/admin');
    });

    // Tải và render lần đầu
    loadCategoriesAndRender();
};

const loadCategoriesAndRender = async () => {
    currentCategories = await getCategories();
    const tableBody = document.querySelector('#category-table-body');
    if (tableBody) {
        tableBody.innerHTML = currentCategories.map(category => `
            <tr data-id="${category.id}">
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="edit-btn admin-button" data-id="${category.id}">Sửa</button>
                    <button class="delete-btn admin-button delete" data-id="${category.id}">Xóa</button>
                </td>
            </tr>
        `).join('');
    }
}


export const AdminCategories = async () => {
    // Chờ DOM load xong để gắn sự kiện
    setTimeout(attachAdminCategoryEvents, 0); 

    // Giao diện quản lý danh mục
    return `
        <div class="admin-container">
            <a href="/admin" class="back-link" id="back-to-admin">← Quay lại Bảng điều khiển</a>
            <h1>📝 Quản Lý Danh Mục Sản Phẩm</h1>
            
            <div class="form-section">
                <h2 id="form-title">Thêm Danh Mục Mới</h2>
                <form id="category-form" class="admin-form">
                    <input type="text" id="category-name-input" placeholder="Tên danh mục" required />
                    <button type="submit" id="submit-btn" class="admin-button primary">Thêm</button>
                    <button type="button" id="cancel-edit-btn" class="admin-button secondary">Hủy</button>
                </form>
            </div>
            
            <h2 class="mt-30">Danh Sách Danh Mục</h2>
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
        <style>
        .main-header { display: none !important; }
        .admin-form { display: flex; gap: 10px; margin-bottom: 20px;}
        .admin-form input { flex-grow: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        </style>
    `;
};