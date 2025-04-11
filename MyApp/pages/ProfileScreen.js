import { Image, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';
import axios from 'axios';

const ProfileScreen = () => {
    const { user, setuser } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        if (user.email) {
            axios.get(`http://localhost:5000/api/user/${user.email}`)
                .then(response => {
                    setUserInfo(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                    setLoading(false);
                });
        }
    }, [user.email]);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/user/change-password`, {
                email: user.email,
                oldPassword,
                newPassword,
            });

            Alert.alert('Thành công', 'Mật khẩu đã được cập nhật!');
            setModalVisible(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật mật khẩu!');
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : userInfo ? (
                <View style={styles.userInfoContainer}>
                    <View style={styles.profileContainer}>
                        <Image source={require('./assets/avatar.png')} style={styles.avatarStyle} />
                        <Text style={styles.username}>{userInfo.firstname} {userInfo.lastname}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('EditScreen')}>
                            <Image source={require('./assets/compose.png')} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userInfoTitle}>Name:</Text>
                    <Text style={styles.textstyle}>{userInfo.firstname} {userInfo.lastname}</Text>

                    <Text style={styles.userInfoTitle}>Username:</Text>
                    <Text style={styles.textstyle}>{userInfo.username}</Text>

                    <Text style={styles.userInfoTitle}>Email:</Text>
                    <Text style={styles.textstyle}>{userInfo.email}</Text>

                    <Text style={styles.userInfoTitle}>Phone Number:</Text>
                    <Text style={styles.textstyle}>{userInfo.phonenumber}</Text>

                    <Text style={styles.userInfoTitle}>Address:</Text>
                    <Text style={styles.textstyle}>{userInfo.housenumber} {userInfo.street} {userInfo.city}</Text>

                    <TouchableOpacity style={styles.changePasswordButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            setuser({ id: "", email: "", username: "" });
                            navigation.navigate('LoginScreen');
                        }}
                    >
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text>Không tìm thấy thông tin người dùng.</Text>
            )}

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu cũ"
                            secureTextEntry={true}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu mới"
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Xác nhận mật khẩu"
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        
                        <TouchableOpacity style={styles.confirmButton} onPress={handleChangePassword}>
                            <Text style={styles.confirmText}>Xác nhận</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    userInfoContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textstyle: {
        fontSize: 18,
        marginBottom: 15,
    },
    avatarStyle: {
        width: 80, 
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    username: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    changePasswordButton: { 
        backgroundColor: '#2196F3', 
        padding: 10, 
        borderRadius: 5, 
        alignItems: 'center', 
        marginBottom: 10 
    },
    changePasswordText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)' 
    },
    modalContent: { 
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10, 
        width: 300 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        textAlign: 'center' },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 10 
    },
    confirmButton: { 
        backgroundColor: '#28a745', 
        padding: 10, 
        borderRadius: 5, 
        alignItems: 'center' 
    },
    confirmText: { 
        color: 'white', 
        fontSize: 16 
    },
    cancelButton: { 
        marginTop: 10, 
        alignItems: 'center' 
    },
    cancelText: { 
        color: '#d9534f', 
        fontSize: 16 
    },
});
