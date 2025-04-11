import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen.js'; 
import RegisterScreen from './screens/RegisterScreen.js';
import ResetPasswordScreen from './screens/ResetPasswordScreen.js';
import HomeTab from './screens/HomeTab.js';
import ProductScreen from './screens/ProductScreen.js';
import BookScreen from './screens/BookScreen.js';
import CartScreen from './screens/CartScreen.js';
import EditScreen from './screens/EditScreen.js';
import { UserContextProvider } from './screens/UserContext.js'; 

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