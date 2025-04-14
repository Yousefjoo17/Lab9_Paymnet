import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/register';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import AddProductScreen from './screens/AddProductScreen';
import Profile from './screens/profile';
import EditProfile from './screens/EditProfile';
import ChangePassword from './screens/ChangePassword';
import Chat from './screens/Chat';
import ProductDetails from './screens/ProductDetails';
import CartScreen from './screens/CartScreen'; 
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <StripeProvider publishableKey="YOUR_STRIPE_PUBLISHABLE_KEY">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="productDetails" component={ProductDetails} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});