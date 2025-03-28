import { ScrollView, View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';

const db = SQLite.openDatabase("shoponline.db");

export default function PageEdit() {
  const navigation = useNavigation();
  const { user, setuser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [firstname, ganFirstname] = useState('');
  const [lastname, ganLastname] = useState('');
  const [username, ganUsername] = useState('');
  const [email, ganEmail] = useState('');
  const [phonenumber, ganphonenumber] = useState('');
  const [housenumber, ganHousenumber] = useState('');
  const [street, ganStreet] = useState('');
  const [city, ganCity] = useState('');

  useEffect(() => {
    if (user.email) { 
        fetch(`http://localhost:5000/api/user/${user.email}`)
            .then(response => response.json())
            .then(data => {
                setUserInfo(data);
                ganFirstname(data.firstname || '');
                ganLastname(data.lastname || '');
                ganUsername(data.username || '');
                ganEmail(data.email || '');
                ganphonenumber(data.phonenumber || '');
                ganHousenumber(data.housenumber || '');
                ganStreet(data.street || '');
                ganCity(data.city || '');
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            });
    }
}, [user.email]);

const updateUserInfo = async () => {
  try {
      const response = await fetch(`http://localhost:5000/api/user/${user.email}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              firstname,
              lastname,
              username,
              phonenumber,
              housenumber,
              street,
              city,
          }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
          Alert.alert("Lỗi", data.message || "Có lỗi xảy ra khi cập nhật.");
      }
  } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server.");
  }
};

useEffect(() => {
  navigation.setOptions({
      headerRight: () => (
          <Image
              source={require('./assets/check.png')}
              style={{ width: 30, height: 30, marginRight: 15 }}
              onTouchEnd={updateUserInfo}
          />
      ),
  });
}, [firstname, lastname, username, phonenumber, housenumber, street, city]);
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <View style={styles.namecontainer}>
          <View style={styles.firstnamecontainer}>
            <Text style={styles.inputtitle}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstname}
              placeholder="Họ"
              onChangeText={ganFirstname}
            />
          </View>
          <View style={styles.lastnamecontainer}>
            <Text style={styles.inputtitle}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastname}
              placeholder="Tên"
              onChangeText={ganLastname}
            />
          </View>
        </View>
        
        <Text style={styles.inputtitle}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Tên đăng nhập"
          onChangeText={ganUsername}
        />

        <Text style={styles.inputtitle}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Email"
          onChangeText={ganEmail}
        />

        <Text style={styles.inputtitle}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phonenumber}
          placeholder="Số điện thoại"
          onChangeText={ganphonenumber}
        />

        <View style={styles.addresscontainer}>
          <View style={styles.housenumbercontainer}>
            <Text style={styles.inputtitle}>House Number</Text>
            <TextInput
              style={styles.input}
              value={housenumber}
              placeholder="Số nhà"
              onChangeText={ganHousenumber}
            />
          </View>

          <View style={styles.streetcontainer}>
            <Text style={styles.inputtitle}>Street</Text>
            <TextInput
              style={styles.input}
              value={street}
              placeholder="Tên đường"
              onChangeText={ganStreet}
            />
          </View>
        </View>

        <Text style={styles.inputtitle}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          placeholder="Tỉnh/Thành phố"
          onChangeText={ganCity}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  titlecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderBottomWidth: 2,
    height: 60,
    marginBottom: 25,
  },
  icontitle: {
    color: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  namecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  firstnamecontainer: {
    flex: 1.8,
    marginRight: 10,
  },
  lastnamecontainer: {
    flex: 1.2,
  },
  addresscontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  housenumbercontainer: {
    flex: 1.4,
    marginRight: 10,
  },
  streetcontainer: {
    flex: 1.6,
  },
  inputtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});