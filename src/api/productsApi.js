// src/api/productsApi.js

import { collection, getDocs, query, where } from "firebase/firestore"; //  IMPORT query, where
import { db } from "../firebase/firebase"; 

/**
 * Lấy danh sách sản phẩm từ Firestore, có thể lọc theo categoryId hoặc searchTerm
 * @param {{ categoryId: string | null, searchTerm: string | null }} filters Bộ lọc
 * @returns {Array<Object>} Danh sách sản phẩm
 */
export  const getProducts = async ({ categoryId = null, searchTerm = null } = {}) => { 
  try {
    const productsCollectionRef = collection(db, "products");
    
    let productsQuery = productsCollectionRef;

    if (categoryId) {
        // Áp dụng lọc theo Danh mục (sử dụng Firestore Query)
        productsQuery = query(productsCollectionRef, where("cate_id", "==", categoryId));
    }
    
    const querySnapshot = await getDocs(productsQuery); 
    
    let productList = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      price: Number(doc.data().price) //  Đảm bảo giá là số
    }));
    
    // Xử lý tìm kiếm bằng chuỗi trên Client (JavaScript)
    if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        productList = productList.filter(product => {
            const productName = product.name ? product.name.toLowerCase() : '';
            return productName.includes(lowerCaseSearch);
        });
    }

    return productList;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    throw error; 
  }
}