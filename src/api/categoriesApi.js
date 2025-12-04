// src/api/categoriesApi.js

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Import đối tượng db

/**
 * Lấy danh sách tất cả danh mục từ Firestore
 * @returns {Array<Object>} Danh sách danh mục ({id, name, ...})
 */
export async function getCategories() {
  try {
    // 1. Lấy tham chiếu đến collection "categories"
    const categoriesCollectionRef = collection(db, "categories");
    
    // 2. Thực hiện truy vấn
    const querySnapshot = await getDocs(categoriesCollectionRef);
    
    // 3. Xử lý kết quả và chuyển đổi thành mảng JavaScript
    const categoryList = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    return categoryList;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu danh mục:", error);
    // Nếu có lỗi, trả về mảng rỗng để không làm lỗi giao diện
    return []; 
  }
}