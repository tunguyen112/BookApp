import { View, Text, Button, Image, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native'


export default function ResetPassword() {
    const navigation = useNavigation();
    const [email, ganEmail] = useState('');
    const [password, ganPassword] = useState('');
    const [confirmpassword, ganconfirmPassword] = useState('');

    const reset = async () => {
        if (email === '' || password === '' || confirmpassword === '') {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (password !== confirmpassword) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/user/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: password })
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Mật khẩu đã được cập nhật!');
                navigation.navigate('Login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert('Lỗi kết nối đến server');
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>

                <View style={styles.titlecontainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('./assets/previous.png')} style={{ width: 30, height: 30}}/>
                </TouchableOpacity>
                <Text style={styles.title}>Đổi mật khẩu</Text>
                </View>

                    <Text style={styles.inputtitle}>Email</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới"
                    value={email}
                    onChangeText={ganEmail}
                    />

                    <Text style={styles.inputtitle}>Password</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChangeText={ganPassword}
                    secureTextEntry={true}
                    />

                    <Text style={styles.inputtitle}>Confirm Password</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Xác nhận lại mật khẩu"
                    value={confirmpassword}
                    onChangeText={ganconfirmPassword}
                    secureTextEntry={true}
                    />

                <Button title="Đặt lại mật khẩu" onPress={reset} />

            </View>
        </SafeAreaView>
    );
};

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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
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