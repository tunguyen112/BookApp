import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import CheckBox from 'react-native-check-box'; 
import { UserContext } from './UserContext';

export default function PageCarts() {
  const { carts, setCarts } = useContext(UserContext);

  const handleIncreaseQty = (item) => {
    const updatedCarts = carts.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, qty: cartItem.qty + 1 }
        : cartItem,
    );
    setCarts(updatedCarts);
  };

  const handleDecreaseQty = (item) => {
    const updatedCarts = carts
      .map((cartItem) =>
        cartItem.id === item.id && cartItem.qty > 1
          ? { ...cartItem, qty: cartItem.qty - 1 }
          : cartItem,
      )
      .filter((cartItem) => cartItem.qty > 0);
    setCarts(updatedCarts);
  };

  const handleRemoveItem = (item) => {
    const updatedCarts = carts.filter((cartItem) => cartItem.id !== item.id);
    setCarts(updatedCarts);
  };

  const handleToggleSelect = (item) => {
    const updatedCarts = carts.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, selected: !cartItem.selected }
        : cartItem,
    );
    setCarts(updatedCarts);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CheckBox
        isChecked={item.selected}
        onClick={() => handleToggleSelect(item)}
        checkBoxColor="#007BFF"
      />
      <Image source={item.image} style={styles.itemImage} />
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
          <Text style={styles.qtyText}>{item.qty}</Text>
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

  const getTotalPrice = () => {
    return carts
      .filter((item) => item.selected)
      .reduce((total, item) => total + item.price * item.qty, 0) 
      .toLocaleString();
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={carts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng trống</Text>}
      />
      <View style={styles.totalContainer}>
        <View>
          <Text>Thành tiền</Text>
          <Text style={styles.totalText}>{getTotalPrice()} VNĐ</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50', 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 5, 
            alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
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
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
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
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});
