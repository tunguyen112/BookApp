import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CheckBox from 'react-native-check-box'; 
import { UserContext } from './UserContext';
import axios from 'axios';

const CartScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchCartData = async () => {
        if (user && user.email) {
          try {
            const { data } = await axios.get(`http://localhost:5000/api/cart/${user.email}`);
            const items = data.cartItems.map(item => ({ ...item, selected: false }));
            setCarts(items);
            setTotalPrice(0);
          } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
            Alert.alert('Lỗi', err.response?.data?.message || 'Không thể lấy giỏ hàng');
          }
        }
      };
      fetchCartData();
    }, [user])
  );

  const calculateTotalPrice = async (selectedItems) => {
    if (selectedItems.length === 0) {
      setTotalPrice(0);
      return;
    }
  
    const bookIds = selectedItems.map(item => item.bookId);
  
    try {
      const { data } = await axios.post('http://localhost:5000/api/cart/totalprice', {
        email: user.email,
        bookIds,
      });
      setTotalPrice(data.totalPrice);
    } catch (error) {
      console.error('Lỗi khi tính tổng tiền:', error);
      setTotalPrice(0);
    }
  };

  const updateCartItem = async (bookId, change) => {
    try {
      await axios.post('http://localhost:5000/api/cart/update', {
        email: user.email,
        bookId,
        change,
      });
  
      const { data } = await axios.get(`http://localhost:5000/api/cart/${user.email}`);
      const updatedItems = data.cartItems.map((item) => {
        const oldItem = carts.find(c => c.bookId === item.bookId);
        return {
          ...item,
          selected: oldItem ? oldItem.selected : false,
        };
      });
  
      setCarts(updatedItems);
      const selectedItems = updatedItems.filter(item => item.selected);
      calculateTotalPrice(selectedItems);
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật số lượng');
    }
  };

  const removeCartItem = async (bookId) => {
    try {
      await axios.post('http://localhost:5000/api/cart/remove', {
        email: user.email,
        bookId,
      });
  
      const { data } = await axios.get(`http://localhost:5000/api/cart/${user.email}`);
      const updatedItems = data.cartItems.map((item) => {
        const oldItem = carts.find(c => c.bookId === item.bookId);
        return {
          ...item,
          selected: oldItem ? oldItem.selected : false,
        };
      });
  
      setCarts(updatedItems);
      const selectedItems = updatedItems.filter(item => item.selected);
      calculateTotalPrice(selectedItems);
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleIncreaseQty = async (item) => {
    await updateCartItem(item.bookId, 1);
  };

  const handleDecreaseQty = async (item) => {
    await updateCartItem(item.bookId, -1);
  };

  const handleRemoveItem = (item) => {
    removeCartItem(item.bookId);
  };

  const handleToggleSelect = async (item) => {
    const updatedCarts = carts.map((cartItem) =>
      cartItem.bookId === item.bookId
        ? { ...cartItem, selected: !cartItem.selected }
        : cartItem,
    );
    setCarts(updatedCarts);

    const selectedItems = updatedCarts.filter(item => item.selected);
    await calculateTotalPrice(selectedItems);
  };

  const handleToggleSelectAll = async () => {
    const allSelected = carts.every(item => item.selected);
    const updatedCarts = carts.map(item => ({ ...item, selected: !allSelected }));
    setCarts(updatedCarts);
  
    const selectedItems = !allSelected ? updatedCarts : [];
    await calculateTotalPrice(selectedItems.filter(item => item.selected));
  };  

  const handleCheckout = async () => {
    const selectedItems = carts.filter(item => item.selected);  
  
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
  
    const bookIds = selectedItems.map(item => item.bookId); 
  
    try {
      const { data } = await axios.post('http://localhost:5000/api/cart/totalprice', {
        email: user.email,
        bookIds,
      });
      Alert.alert('Thông báo', `Tổng tiền: ${data.totalPrice.toLocaleString()} VNĐ`);
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán');
    }
  };

  const renderItem = ({ item }) => (
  <TouchableOpacity onPress={() => navigation.navigate('BookScreen', { bookId: item.bookId })}>
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.selectAllContainer}>
        <TouchableOpacity onPress={handleToggleSelectAll} style={styles.selectAllButton}>
          <Text style={styles.selectAllText}>
            {carts.every(item => item.selected) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.totalText}>{totalPrice.toLocaleString()} VNĐ</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50', 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 5, 
            alignItems: 'center',
          }}
          onPress={handleCheckout}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CartScreen;

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
  selectAllContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  selectAllButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  selectAllText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
