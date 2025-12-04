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
    serverTimestamp // Dùng cho trường hợp thêm/sửa cần timestamp
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
            createdAt: serverTimestamp() // Thêm timestamp
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
 * Xóa một danh mục
 * @param {string} id - ID của danh mục cần xóa
 */
export async function deleteCategory(id) {
    try {
        const categoryDocRef = doc(db, "categories", id);
        await deleteDoc(categoryDocRef);
        alert("Xóa danh mục thành công!");
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        // Lưu ý: Nếu có sản phẩm phụ thuộc, cần xử lý lỗi hoặc xóa sản phẩm liên quan
        alert("Xóa danh mục thất bại (Kiểm tra xem còn sản phẩm liên quan không?).");
        return false;
    }
}


// --- Quản lý Đơn hàng (Orders) ---

/**
 * Lấy danh sách tất cả đơn hàng
 */
export async function getOrders() {
    try {
        const ordersCollectionRef = collection(db, "orders");
        // Sắp xếp theo thời gian tạo mới nhất
        const ordersQuery = query(ordersCollectionRef, orderBy("createdAt", "desc")); 
        const querySnapshot = await getDocs(ordersQuery);
        
        const orderList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Chuyển đổi timestamp thành đối tượng Date
          createdAt: doc.data().createdAt?.toDate() || new Date() 
        }));
        
        return orderList;

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        return []; 
    }
}

/**
 * Cập nhật trạng thái đơn hàng
 * @param {string} id - ID của đơn hàng
 * @param {string} newStatus - Trạng thái mới ('Pending', 'Processing', 'Completed', 'Cancelled')
 */
export async function updateOrderStatus(id, newStatus) {
    try {
        const orderDocRef = doc(db, "orders", id);
        await updateDoc(orderDocRef, { status: newStatus });
        return true;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return false;
    }
}

// --- Thống kê (Stats) ---

/**
 * Lấy dữ liệu thống kê cơ bản từ collection orders
 * @returns {Object} { totalRevenue: number, totalProductsSold: number }
 */
export async function getStats() {
    try {
        const orders = await getOrders();
        
        let totalRevenue = 0;
        let totalProductsSold = 0;
        
        // Chỉ tính các đơn hàng đã hoàn thành (Completed) cho doanh thu/sản phẩm bán được
        const completedOrders = orders.filter(order => order.status === 'Completed');

        completedOrders.forEach(order => {
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