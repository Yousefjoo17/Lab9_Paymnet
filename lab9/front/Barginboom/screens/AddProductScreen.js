import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function AddProductScreen({ navigation }) {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    basePrice: '',
    quantity: '',
    isAuction: false,
    category: '',
    imageUrls: ['https://via.placeholder.com/150'] // Default placeholder image
  });

  const handleAddProduct = () => {
    // Basic validation
    if (!product.title || !product.description || !product.basePrice || !product.quantity) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Navigate back to Home with the new product
    navigation.navigate('Home', { newProduct: product });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Product</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Product Title*"
        value={product.title}
        onChangeText={(text) => setProduct({...product, title: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Description*"
        value={product.description}
        onChangeText={(text) => setProduct({...product, description: text})}
        multiline
      />
      
      <TextInput
        style={styles.input}
        placeholder="Price*"
        value={product.basePrice}
        onChangeText={(text) => setProduct({...product, basePrice: text})}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Quantity*"
        value={product.quantity}
        onChangeText={(text) => setProduct({...product, quantity: text})}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={product.category}
        onChangeText={(text) => setProduct({...product, category: text})}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FB',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});