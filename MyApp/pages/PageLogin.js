
import React, { useState, createRef, useContext } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { UserContextProvider, UserContext } from './UserContext.js'; 

const PageLogin = ({ navigation }) => {
  const { setuser } = useContext(UserContext);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrortext('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.ok) {
        setuser({ email, username: result.username });
        Alert.alert('Thành công', `Chào mừng, ${result.username}!`, [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } else {
        Alert.alert('Lỗi', result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    }
  };

  return (
    <UserContextProvider>
      <View style={styles.mainBody}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <View>
            <KeyboardAvoidingView enabled>

              <Image
                  source={require('./assets/Logo.png')} 
                  style={styles.logoStyle}
              />

              <Text
                style={styles.welcomestyle}>
                Welcome
              </Text>

              <View style={styles.SectionStyle}>
                <View style={styles.inputContainer}>

                  <Image source={require('./assets/email.png')} style={styles.icon} />

                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={setemail}
                    placeholder="Enter Email"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      passwordInputRef.current && passwordInputRef.current.focus()
                    }
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                  />

                </View>
              </View>

              <View style={styles.SectionStyle}>
                <View style={styles.inputContainer}>

                <Image source={require('./assets/padlock.png')} style={styles.icon} />

                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={setpassword}
                    placeholder="Enter Password"
                    placeholderTextColor="#8b9cb5"
                    keyboardType="default"
                    ref={passwordInputRef}
                    secureTextEntry
                    underlineColorAndroid="#f000"
                    returnKeyType="next"
                  />

                </View>
              </View>

              {errortext ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}

              <Text
                style={styles.forgotstyle}
                
                onPress={() => {
                setemail('');
                setpassword('');
                navigation.navigate('Resetpassword')}}>
                Forgot password?
              </Text>

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleLogin}>
                <Text style={styles.buttonTextStyle}>LOG IN</Text>
              </TouchableOpacity>

              <Text style={styles.loginwithstyle}>
                Or login with
              </Text>

              <View style={styles.signupcontainer}>
                <Image
                    source={require('./assets/FB.png')} 
                    style={styles.logosignupStyle}
                />
                <Image
                  source={require('./assets/GG.png')} 
                  style={styles.logosignupStyle}
                />
              </View>
              
              <View style={styles.signupcontainer}>
                <Text style={styles.registerTextStyle}>
                  Don't have an account? 
                </Text>
                <Text
                  style={styles.registerTextStyle1}
                  onPress={() => {
                  setemail('');
                  setpassword('');
                  navigation.navigate('Register')}}>
                  Sign up here!
                </Text>
              </View>

            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </UserContextProvider>
  );
};

export default PageLogin;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  SectionStyle: {
    width: '100%',
    height: 60,
    marginBottom: 20,
  },
  logoStyle: {
    width: 150,  
    height: 150,  
    marginBottom: 10,
    alignSelf: 'center'
  },
  welcomestyle: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
  inputStyle: {          
    paddingLeft: 50,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    minWidth: 350,  
    minHeight: 60,
    borderColor: '#dadae8',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
    position: 'absolute',
    top: 15,
    left: 10,
  },
  buttonStyle: {
    backgroundColor: '#FF8F00',
    borderWidth: 0,
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 18,
  },
  loginwithstyle: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  forgotstyle: {
    color: 'red',
    fontSize: 13,
    textAlign: 'right',
    marginTop: -15,
  },
  signupcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logosignupStyle: {
    width: 50,  
    height: 50,  
    marginBottom: 10,
    marginHorizontal: 5,
  },
  registerTextStyle: {
    color: '#1c313a',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  registerTextStyle1: {
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorTextStyle: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
  },
});
