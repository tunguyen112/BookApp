import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, SectionList, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const HomePage = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [books, setBooks] = useState([]);
  const [groupedBooks, setGroupedBooks] = useState([]);

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

  const filteredBooks = searchText
    ? books.filter((book) => {
        const normalizedSearchText = removeVietnameseTones(searchText.toLowerCase());
        const normalizedTitle = removeVietnameseTones(book.title.toLowerCase());
        return normalizedTitle.includes(normalizedSearchText);
      })
    : [];

  useEffect(() => {
    const categories = Array.from(new Set(books.map((book) => book.category)));
    const grouped = categories.map((category) => ({
      title: category,
      data: books.filter(
        (book) =>
          book.category === category &&
          book.title.toLowerCase().includes(searchText.toLowerCase())
      ),
    }));
    setGroupedBooks(grouped);
  }, [searchText, books]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PageBook', { bookId: item.bookId })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm"
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.bookId.toString()}
        />
      ) : (
        <SectionList
          sections={groupedBooks}
          keyExtractor={(item) => item.bookId.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
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
  listContainer: {
    paddingBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    padding: 5,
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

export default HomePage;
