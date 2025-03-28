import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageLogin from './pages/PageLogin.js'; 
import PageRegister from './pages/PageRegister.js';
import ResetPassword from './pages/ResetPassword.js';
import PageHome from './pages/PageHome.js';
import PageProduct from './pages/PageProduct.js';
import PageBook from './pages/PageBook.js';
import PageCarts from './pages/PageCarts.js';
import PageEdit from './pages/PageEdit.js';
import { UserContextProvider } from './pages/UserContext.js'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            
            <Stack.Screen
              name="Login"
              component={PageLogin}
              options={{ headerShown: false }}
            />
            
            <Stack.Screen
              name="Register"
              component={PageRegister}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Resetpassword"
              component={ResetPassword}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Home"
              component={PageHome}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="PageProduct"
              component={PageProduct}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="PageBook"
              component={PageBook}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Carts"
              component={PageCarts}
              options={{ headerShown: true }}
            />

            <Stack.Screen
              name="EditProfile"
              component={PageEdit}
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