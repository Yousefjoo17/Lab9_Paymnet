import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hardcoded users data for login validation
  const users = [
    {
      name: "semsema",
      email: "joo",
      password: "123",
      role: "buyer",
      avatarUrl: 'https://i.pravatar.cc/150?img=3'
    },
    {
      name: "Youssef",
      email: "j",
      password: "1",
      role: "seller",
      avatarUrl: 'https://ew.com/thmb/Liy5PFa7Cmkdn_58hrmjmLsxJsU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/breaking-bad-24-85d86e7db76e4b93890a28c7baa924d1.jpg'
    }
  ];

const handleLogin = () => {
  const loggedInUser = users.find(user => 
    user.email === email && user.password === password
  );

  if (loggedInUser) {
    navigation.navigate('Home', { 
      user: {  // Pass the entire user object
        name: loggedInUser.name,
        avatarUrl: loggedInUser.avatarUrl,
        role: loggedInUser.role
      }
    });
  } else {
    Alert.alert("Invalid credentials", "Please check your email and password.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F9FB',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  link: {
    color: '#1E88E5',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});