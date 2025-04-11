import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const navigation = useNavigation();
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

  useEffect(() => {
    const categories = Array.from(new Set(books.map((book) => book.category)));
    const grouped = categories.map((category) => ({
      title: category,
      data: books.filter((book) => book.category === category),
    }));
    setGroupedBooks(grouped);
  }, [books]);

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

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
        <View style={styles.fakeSearchBar}>
          <Text style={{ color: '#aaa' }}>Tìm kiếm</Text>
        </View>
      </TouchableOpacity>

      <SectionList
        sections={groupedBooks}
        keyExtractor={(item) => item.bookId.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  fakeSearchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
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


