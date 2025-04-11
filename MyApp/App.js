import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/LoginScreen.js'; 
import RegisterScreen from './pages/RegisterScreen.js';
import ResetPasswordScreen from './pages/ResetPasswordScreen.js';
import HomeTab from './pages/HomeTab.js';
import ProductScreen from './pages/ProductScreen.js';
import BookScreen from './pages/BookScreen.js';
import CartScreen from './pages/CartScreen.js';
import EditScreen from './pages/EditScreen.js';
import { UserContextProvider } from './pages/UserContext.js'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
            
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ResetpasswordScreen"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Home"
              component={HomeTab}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ProductScreen"
              component={ProductScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="BookScreen"
              component={BookScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={{ headerShown: true }}
            />

            <Stack.Screen
              name="EditScreen"
              component={EditScreen}
              options={{
                        title: 'EditProfile',
                        headerStyle: {
                          backgroundColor: 'white', 
                        },
                        headerTintColor: 'black',
                        headerTitleStyle: {
                          fontWeight: 'bold',
                        },
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
    </UserContextProvider>
  );
};

export default App;