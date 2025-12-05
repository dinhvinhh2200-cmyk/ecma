// src/components/header.js

import { navigateTo } from "../router";
import { getCategories } from "../api/categoriesApi";
import { updateCartCount, getCart } from "../utils/cart"; 

// gắn tất cả sự kiện tương tác (tìm kiếm , lọc danh mục)
const attachHeaderEvents = () => {
    // gan su kien dieu huong qua cac link chung bang class (.spa-link)
    document.querySelectorAll('.spa-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Chặn mặc định cho các link có href='#'
            if (href === '#' || href === '/cart') { 
                 e.preventDefault();
            }
            navigateTo(href); 
        })
    })

    // 2 gan su kien cho form tim kiem 
    const searchForm = document.querySelector('#search-form')
    searchForm?.addEventListener('submit', (e) => {
        e.preventDefault()
        const searchTerm = document.querySelector('#search-input').value.trim()
        if (searchTerm) {
            navigateTo(`/?search=${encodeURIComponent(searchTerm)}`)
        }else {
            navigateTo('/') 
        }
    })

    // 3 loc danh muc san pham trong dropdow
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const categoryId = e.target.dataset.id 

            if (categoryId === 'all') {
                navigateTo('/')
            }else {
                navigateTo(`/?cate_id=${categoryId}`)
            }
        })
    })
}

// ham render header 
export const renderHeader = async () => {
    let categories = []
    try {
        categories = await getCategories() 
    } catch(e) {
        console.error('Khong the tai danh muc cho header', e)
    }

    const dropdownLinks = categories.map(category => `
        <a href='/?cate_id=${category.id}' class='dropdown-link' data-id='${category.id}'>
            ${category.name}
        </a>
        `).join('')

    const cart = getCart();
    const initialCartCount = cart.reduce((total, item) => total + item.quantity, 0); 

    const headerHtml = `
    <header class='main-header'>
        <div class=header-container>
            <div class='logo'>
                <a href='/' class='spa-link'><h1>LAPSTORE</h1></a>
            </div>

            <nav class='main-nav'>
                <div class='nav-item dropdown'>
                    <a href='/' class='spa-link'>Sản phẩm</a>
                    <div class='dropdown-content'>
                        <a href='/' class='dropdown-link' data-id='all'>Tất cả sản phẩm</a>
                        ${dropdownLinks}
                    </div>
                </div>
                <a href='/cart' class='spa-link cart-link'> 
                    Giỏ hàng 
                    <span class="cart-count">${initialCartCount}</span> 
                </a>
                <a href='/admin' class='spa-link' style="margin-left: 15px; color: #ff6600;">Admin Dashboard</a>
            </nav>

            <div class='search-bar'>
                 <form id="search-form">
                        <input type="text" id="search-input" placeholder="Tìm kiếm sản phẩm..." />
                        <button type="submit">Tìm kiếm</button>
                    </form>
            </div>
        </div>
    </header>
    `

    const appContainer = document.querySelector('#app')
     if (!appContainer) return; 

    if (!document.querySelector('.main-header')) {
        appContainer.insertAdjacentHTML('beforebegin', headerHtml);
        
        const newHeader = document.querySelector('.main-header');
        if (newHeader) {
            // Mặc định header là flex. Router sẽ ẩn nó nếu vào trang admin.
            newHeader.style.display = 'flex';
        }
    }
    
    attachHeaderEvents();
    updateCartCount(); 
}