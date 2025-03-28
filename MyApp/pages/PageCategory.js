import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';

const categories = [
  "Tiểu thuyết", 
  "Phi hư cấu", 
  "Khoa học viễn tưởng", 
  "Kinh doanh", 
  "Kỹ năng sống", 
  "Kỳ ảo", 
  "Hồi ký"
];

export default function PageCategory({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PageProduct', { category: item })}
      activeOpacity={0.8}>
      <Text style={styles.cardTitle}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});