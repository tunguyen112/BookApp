import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ProductScreen = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        const data = response.data;
        setBooks(data.filter(book => book.category === category));
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookScreen', { bookId: item.bookId })}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

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

      <Text style={styles.categoryTitle}>{category}</Text>

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookId.toString()}
      />
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    elevation: 3,
  },
  cardImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardPrice: {
    fontSize: 14,
    color: 'red',
  },
});
