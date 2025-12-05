// src/main.js 

// Import router.js để đảm bảo file được thực thi
import './router.js'; 

// Import các component cần thiết nếu muốn gọi chúng trực tiếp
import { renderHeader } from './components/header';
import { router } from './router'; 

// FIX: Loại bỏ document.addEventListener. Router.js sẽ tự chạy một lần duy nhất.
// Tuy nhiên, chúng ta cần đảm bảo header được render một lần đầu tiên
// trước khi router chạy (nếu header không được chèn tĩnh vào index.html).
// Trong trường hợp này, vì renderHeader() có logic kiểm tra nếu header tồn tại, 
// ta sẽ gọi nó trực tiếp.

// 1. Render Header (thành phần tĩnh, chỉ chạy 1 lần)
renderHeader(); 

// FIX: BỎ LỠI: Đảm bảo router chạy lần đầu sau khi header đã được chèn.
// Vì router.js đã có document.addEventListener('DOMContentLoaded', router), 
// ta sẽ xóa document.addEventListener trong router.js và gọi trực tiếp router() ở đây.