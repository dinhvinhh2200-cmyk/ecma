// src/api/adminApi.js
import { db } from "../firebase/firebase";
import { 
    collection, 
    getDocs, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    deleteField,
    where
} from "firebase/firestore";

// --- CRUD Danh mục (Categories) ---

/**
 * Thêm một danh mục mới vào Firestore
 * @param {Object} categoryData - { name: string }
 */
export async function addCategory(categoryData) {
    try {
        const categoriesCollectionRef = collection(db, "categories");
        await addDoc(categoriesCollectionRef, { 
            ...categoryData,
            createdAt: serverTimestamp() 
        });
        alert("Thêm danh mục thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        alert("Thêm danh mục thất bại. Vui lòng kiểm tra console.");
        return false;
    }
}

/**
 * Cập nhật một danh mục
 * @param {string} id - ID của danh mục cần cập nhật
 * @param {Object} categoryData - Dữ liệu mới { name: string }
 */
export async function updateCategory(id, categoryData) {
    try {
        const categoryDocRef = doc(db, "categories", id);
        await updateDoc(categoryDocRef, categoryData);
        alert("Cập nhật danh mục thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        alert("Cập nhật danh mục thất bại. Vui lòng kiểm tra console.");
        return false;
    }
}

/**
 * Xóa một danh mục và loại bỏ ràng buộc sản phẩm
 * @param {string} id - ID của danh mục cần xóa
 */
export async function deleteCategory(id) {
    try {
        // BƯỚC 1: Xóa ràng buộc sản phẩm (xóa trường cate_id)
        const productsCollectionRef = collection(db, "products");
        const productsToDeleteQuery = query(productsCollectionRef, where("cate_id", "==", id)); 
        const productSnapshot = await getDocs(productsToDeleteQuery);
        
        const updatePromises = [];

        productSnapshot.forEach((productDoc) => {
            const productRef = doc(db, "products", productDoc.id);
            // Xóa trường cate_id khỏi sản phẩm
            updatePromises.push(updateDoc(productRef, { 
                cate_id: deleteField() 
            }));
        });
        
        await Promise.all(updatePromises);
        
        // BƯỚC 2: Xóa danh mục
        const categoryDocRef = doc(db, "categories", id);
        await deleteDoc(categoryDocRef);
        
        alert("Xóa danh mục thành công và đã cập nhật các sản phẩm liên quan!");
        return true;
    } catch (error) {
        // Đây là nơi hiển thị lỗi quyền truy cập
        console.error("Lỗi khi xóa danh mục:", error); 
        alert(`Xóa danh mục thất bại. Lỗi quyền truy cập Firebase: ${error.message}`);
        return false;
    }
}


// --- CRUD Sản phẩm (Products) ---

/**
 * Thêm một sản phẩm mới vào Firestore
 * @param {Object} productData - { name: string, price: number, image: string, cate_id: string }
 */
export async function addProduct(productData) {
    try {
        const productsCollectionRef = collection(db, "products");
        await addDoc(productsCollectionRef, { 
            ...productData,
            price: Number(productData.price),
            createdAt: serverTimestamp() 
        });
        alert("Thêm sản phẩm thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert(`Thêm sản phẩm thất bại. Lỗi quyền truy cập Firebase: ${error.message}`);
        return false;
    }
}

/**
 * Cập nhật một sản phẩm
 * @param {string} id - ID của sản phẩm cần cập nhật
 * @param {Object} productData - Dữ liệu mới
 */
export async function updateProduct(id, productData) {
    try {
        const productDocRef = doc(db, "products", id);
        await updateDoc(productDocRef, {
            ...productData,
            price: Number(productData.price) 
        });
        alert("Cập nhật sản phẩm thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert(`Cập nhật sản phẩm thất bại. Lỗi quyền truy cập Firebase: ${error.message}`);
        return false;
    }
}

/**
 * Xóa một sản phẩm
 * @param {string} id - ID của sản phẩm cần xóa
 */
export async function deleteProduct(id) {
    try {
        const productDocRef = doc(db, "products", id);
        await deleteDoc(productDocRef);
        alert("Xóa sản phẩm thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert(`Xóa sản phẩm thất bại. Lỗi quyền truy cập Firebase: ${error.message}`);
        return false;
    }
}


// --- Quản lý Đơn hàng (Orders) ---

/**
 * Thêm một đơn hàng mới vào Firestore (Chức năng Thanh toán)
 * @param {Object} orderData - { items: Array, totalPrice: number, customerName: string, status: string }
 * @returns {string | null} ID của đơn hàng vừa tạo, hoặc null nếu thất bại
 */
export async function addOrder(orderData) {
    try {
        const ordersCollectionRef = collection(db, "orders");
        // Dùng serverTimestamp cho createdAt
        const docRef = await addDoc(ordersCollectionRef, { 
            ...orderData,
            createdAt: serverTimestamp() 
        });
        return docRef.id;
    } catch (error) {
        console.error("Lỗi khi thêm đơn hàng:", error);
        alert("Đặt hàng thất bại. Vui lòng kiểm tra console.");
        return null;
    }
}


/**
 * Xóa một đơn hàng
 * @param {string} id - ID của đơn hàng cần xóa
 */
export async function deleteOrder(id) { 
    try {
        const orderDocRef = doc(db, "orders", id);
        await deleteDoc(orderDocRef); 
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        return false;
    }
}


/**
 * Lấy danh sách tất cả đơn hàng
 */
export async function getOrders() {
    try {
        const ordersCollectionRef = collection(db, "orders");
        const ordersQuery = query(ordersCollectionRef, orderBy("createdAt", "desc")); 
        const querySnapshot = await getDocs(ordersQuery);
        
        const orderList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date() 
        }));
        
        return orderList;

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        return []; 
    }
}

// --- Thống kê (Stats) ---

/**
 * Lấy dữ liệu thống kê cơ bản từ collection orders
 * CHỈ tính các đơn hàng có trạng thái 'Completed' vào doanh thu
 * @returns {Object} { totalRevenue: number, totalProductsSold: number }
 */
export async function getStats() {
    try {
        const orders = await getOrders();
        
        let totalRevenue = 0;
        let totalProductsSold = 0;
        
        const calculatedOrders = orders.filter(order => order.status === 'Completed');

        calculatedOrders.forEach(order => {
            totalRevenue += order.totalPrice || 0;
            
            if (Array.isArray(order.items)) {
                totalProductsSold += order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            }
        });
        
        return { totalRevenue, totalProductsSold };

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        return { totalRevenue: 0, totalProductsSold: 0 };
    }
}