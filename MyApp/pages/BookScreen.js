import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';
import axios from 'axios';

const BookScreen = ({ route }) => {
  const { bookId } = route.params;
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const { carts, setCarts } = useContext(UserContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
        setSelectedBook(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu sách.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (error || !selectedBook) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Không tìm thấy sách!'}</Text>
      </SafeAreaView>
    );
  }

  const addToCart = async () => {
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để thêm vào giỏ hàng.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        email: user.email,
        bookId: selectedBook.bookId,
        quantity: 1,
      });

      if (response.status === 200) {
        setCarts(response.data.cartItems);
        Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng.');
      } else {
        Alert.alert('Lỗi', response.data.message || 'Không thể thêm vào giỏ hàng.');
      }
    } catch (error) {
      //Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm vào giỏ hàng.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/previous.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
            <Image source={require('./assets/search.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CartScreen')}>
            <Image source={require('./assets/grocery-store.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Image source={require('./assets/home1.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: selectedBook.image }} style={styles.bookImage} />
        <Text style={styles.bookTitle}>{selectedBook.title}</Text>
        <Text style={styles.bookCategory}>{selectedBook.category}</Text>
        <Text style={styles.bookDescription}>{selectedBook.description}</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.bookPrice}>{selectedBook.price.toLocaleString()} VND</Text>

        <TouchableOpacity onPress={addToCart}>
          <Text style={styles.addToCart}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50',
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  button: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bookImage: {
    width: 180,
    height: 270,
    borderRadius: 8,
    marginBottom: 15,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  bookCategory: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  bookDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
    marginBottom: 15,
  },
  bookPrice: {
    textAlign: 'center',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  addToCart: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: 100,
    paddingLeft: 20,
    textAlign: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: '#555',
    marginLeft: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
