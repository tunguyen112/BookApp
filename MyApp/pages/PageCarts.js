import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box'; 
import { UserContext } from './UserContext';

export default function PageCarts() {
  const { user, carts, setCarts } = useContext(UserContext);

  useEffect(() => {
    const fetchCartData = async () => {
      if (user && user.email) {
        try {
          const response = await fetch(`http://localhost:5000/api/cart/${user.email}`);
          const data = await response.json();

          if (response.ok) {
            setCarts(data.cartItems);
          } else {
            Alert.alert('Lỗi', data.message || 'Không thể lấy giỏ hàng');
          }
        } catch (err) {
          console.error('Lỗi khi tải giỏ hàng:', err);
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải giỏ hàng');
        }
      }
    };

    fetchCartData();
  }, [user]);

  const removeCartItem = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, bookId }),
      });
  
      if (!response.ok) {
        throw new Error('Không thể xóa sản phẩm');
      }

      const updatedResponse = await fetch(`http://localhost:5000/api/cart/${user.email}`);
      const updatedCart = await updatedResponse.json();
  
      if (updatedResponse.ok) {
        setCarts(updatedCart.cartItems);
      } else {
        throw new Error('Không thể cập nhật giỏ hàng');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };  

  const updateCartItem = async (bookId, change) => {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, bookId, change }),
        });

        const result = await response.json();

        if (!response.ok) {
            Alert.alert('Thông báo', result.message || 'Không thể cập nhật số lượng');
            return;
        }

        const updatedResponse = await fetch(`http://localhost:5000/api/cart/${user.email}`);
        const updatedCart = await updatedResponse.json();

        if (!updatedResponse.ok) {
            throw new Error('Không thể tải giỏ hàng sau khi cập nhật');
        }

        if (updatedCart?.cartItems) {
            setCarts(updatedCart.cartItems);
        } else {
            throw new Error('Dữ liệu trả về không hợp lệ');
        }
    } catch (error) {
        Alert.alert('Lỗi', error.message);
    }
};

  const handleIncreaseQty = (item) => {
    updateCartItem(item.bookId, 1);
  };
  
  const handleDecreaseQty = (item) => {
    updateCartItem(item.bookId, -1); 
  };  

  const handleRemoveItem = (item) => {
    removeCartItem(item.bookId);
  };

  const handleToggleSelect = (item) => {
    const updatedCarts = carts.map((cartItem) =>
      cartItem.bookId === item.bookId
        ? { ...cartItem, selected: !cartItem.selected }
        : cartItem,
    );
    setCarts(updatedCarts);
  };

  const handleCheckout = async () => {
    const selectedItems = carts.filter(item => item.selected);  // Lọc các sản phẩm đã được chọn
    console.log("Selected Items:", selectedItems);
    
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
  
    const bookIds = selectedItems.map(item => item.bookId); // Lấy danh sách bookId của các sản phẩm đã chọn
    console.log("Book IDs:", bookIds);
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, bookIds }),
      });
  
      const result = await response.json();
      console.log("Server Response:", result); // Kiểm tra dữ liệu trả về từ server
  
      if (response.ok) {
        // Nhận tổng tiền từ backend và hiển thị lên giao diện
        Alert.alert('Thông báo', `Tổng tiền: ${result.totalPrice.toLocaleString()} VNĐ`);
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể tính tổng tiền');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thanh toán');
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CheckBox
        isChecked={item.selected}
        onClick={() => handleToggleSelect(item)}
        checkBoxColor="#007BFF"
      />
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} VNĐ</Text>
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleDecreaseQty(item)}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleIncreaseQty(item)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={carts}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookId.toString()}
        extraData={carts}
        ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng trống</Text>}
      />
      <View style={styles.totalContainer}>
        <View>
          <Text>Thành tiền</Text>
          <Text style={styles.totalText}> VNĐ</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50', 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 5, 
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} onPress={handleCheckout}>
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  qtyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#FF3B30',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});
