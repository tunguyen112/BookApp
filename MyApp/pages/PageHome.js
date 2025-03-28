import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import PageCategory from './PageCategory.js';
import PageCarts from './PageCarts.js';
import PageProfile from './PageProfile.js';
import HomePage from './HomePage.js';

const Tab = createBottomTabNavigator();

export default function Quanly() {
  return (
    <Tab.Navigator
    initialRouteName="Home" 
    screenOptions={({ route }) => ({
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#4CAF50' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarShowLabel: false,

        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = focused
                ? require('./assets/home1.png') 
                : require('./assets/home.png');
          } else if (route.name === 'Category') {
            iconSource = focused
                ? require('./assets/grid.png')
                : require('./assets/menu.png');
          } else if (route.name === 'Carts') {
            iconSource = focused
                ? require('./assets/grocery-store.png') 
                : require('./assets/shopping-cart.png');
          } else if (route.name === 'Profile') {
            iconSource = focused
                ? require('./assets/profile-user.png') 
                : require('./assets/user.png');
          }
          return (
            <Image source={iconSource} style={{ width: 24, height: 24 }} />
          );
        }
      })}>

        <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
            title: 'UIT Books',
            headerStyle: {
              backgroundColor: '#4CAF50', 
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
        }}
        />
    
        <Tab.Screen
        name="Category"
        component={PageCategory}
        options={{
            title: 'Danh mục sản phẩm',
            headerStyle: {
              backgroundColor: '#4CAF50', 
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
        }}
        />

        <Tab.Screen
        name="Carts"
        component={PageCarts}
        />

        <Tab.Screen
        name="Profile"
        component={PageProfile}
        options={{
            title: 'Thông tin người dùng',
            headerStyle: {
              backgroundColor: '#4CAF50', 
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
        }}
        />
  </Tab.Navigator>
  )
}