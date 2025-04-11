import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error("Lỗi khi tải sách:", error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const normalizedSearch = removeVietnameseTones(searchText.toLowerCase());
    const filtered = books.filter((book) =>
      removeVietnameseTones(book.title.toLowerCase()).includes(normalizedSearch)
    );
    setFilteredBooks(filtered);
  }, [searchText, books]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookScreen', { bookId: item.bookId })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm sách..."
        value={searchText}
        onChangeText={setSearchText}
      />
      
      {searchText.trim() !== '' && (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.bookId.toString()}
        />
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 140,
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

export default SearchScreen;
