
import { View, Text, Button, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function PageRegister() {
  const navigation = useNavigation();
  const [firstname, ganFirstname] = useState('');
  const [lastname, ganLastname] = useState('');
  const [username, ganUsername] = useState('');
  const [email, ganEmail] = useState('');
  const [phonenumber, ganphonenumber] = useState('');
  const [housenumber, ganHousenumber] = useState('');
  const [street, ganStreet] = useState('');
  const [city, ganCity] = useState('');
  const [password, ganPassword] = useState('');

  const themNguoiDung = async () => {
    if (!firstname || !lastname || !username || !email || !password) {
        Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                username,
                email,
                phonenumber,
                housenumber,
                street,
                city,
                password
            })
        });

        const result = await response.json();

        if (response.ok) {
            Alert.alert('Thông báo', result.message, [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);

            // Reset dữ liệu nhập
            ganFirstname('');
            ganLastname('');
            ganUsername('');
            ganEmail('');
            ganphonenumber('');
            ganHousenumber('');
            ganStreet('');
            ganCity('');
            ganPassword('');
        } else {
            Alert.alert('Lỗi', result.message);
        }
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        Alert.alert('Lỗi', 'Không thể kết nối đến server.');
    }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <View style={styles.titlecontainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('./assets/previous.png')} style={{ width: 30, height: 30}}/>
          </TouchableOpacity>
          <Text style={styles.title}>Đăng Ký Người Dùng</Text>
        </View>
        
        <View style={styles.namecontainer}>
            <View style={styles.firstnamecontainer}>
              <Text style={styles.inputtitle}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Họ"
                value={firstname}
                onChangeText={ganFirstname}
              />
            </View>
            <View style={styles.lastnamecontainer}>
              <Text style={styles.inputtitle}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên"
                value={lastname}
                onChangeText={ganLastname}
              />
            </View>

        </View>
        
        <Text style={styles.inputtitle}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={ganUsername}
        />

        <Text style={styles.inputtitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={ganEmail}
        />

        <Text style={styles.inputtitle}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phonenumber}
          onChangeText={ganphonenumber}
        />
        <View style={styles.addresscontainer}>
          <View style={styles.housenumbercontainer}>
            <Text style={styles.inputtitle}>House Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Số nhà"
              value={housenumber}
              onChangeText={ganHousenumber}
            />
          </View>

          <View style={styles.streetcontainer}>
            <Text style={styles.inputtitle}>Street</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên đường"
              value={street}
              onChangeText={ganStreet}
            />
          </View>
        </View>

        <Text style={styles.inputtitle}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Tỉnh/Thành phố"
          value={city}
          onChangeText={ganCity}
        />

        <Text style={styles.inputtitle}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={ganPassword}
          secureTextEntry={true}
        />

          <Button title="Đăng Ký" onPress={themNguoiDung} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
