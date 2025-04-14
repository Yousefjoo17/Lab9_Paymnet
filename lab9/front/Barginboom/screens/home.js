import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialProducts = [
  {
    title: "Laptop",
    description: "Brand new laptop",
    basePrice: 1000,
    quantity: 10,
    isAuction: false,
    category: "Electronics",
    imageUrls: ["https://elctoys.qa/cdn/shop/products/215510638_500x.png?v=1675752904"],
    auctionEnd: null // Not an auction item
  },
  {
    title: "Smartphone",
    description: "Latest model smartphone",
    basePrice: 800,
    quantity: 15,
    isAuction: true, // This is now an auction item
    category: "Electronics",
    imageUrls: ["https://elctoys.qa/cdn/shop/products/215510638_500x.png?v=1675752904"],
    auctionEnd: "2025-6-31T23:59:59" // ISO 8601 format
  },
  {
    title: "Headphones",
    description: "Noise-cancelling wireless",
    basePrice: 200,
    quantity: 20,
    isAuction: true, // This is now an auction item
    category: "Electronics",
    imageUrls: ["https://elctoys.qa/cdn/shop/products/215510638_500x.png?v=1675752904"],
    auctionEnd: "2025-6-30T18:00:00" // ISO 8601 format
  }
];

export default function HomeScreen({ navigation, route }) {
  const [products, setProducts] = useState(initialProducts);

  const currentUser = route.params?.user || { name: 'Guest', avatarUrl: '', role: 'buyer' };

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.imageUrls[0] }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>${item.basePrice}</Text>
      <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
      <TouchableOpacity 
        style={styles.productButton}
        onPress={() => navigation.navigate('productDetails', { 
          product: item,
          currentUser: currentUser  // Add this line to pass the current user
        })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile', { user: currentUser })}
        >
          <Image 
            source={{ uri: currentUser.avatarUrl }} 
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{currentUser.name}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
    style={styles.floatingCartIcon}
    onPress={() => navigation.navigate('Cart')}
  >
  <Ionicons name="cart" size={24} color="white" />
</TouchableOpacity>
      </View>

      {/* Only show Add Product button for sellers */}
      {currentUser.role === 'seller' && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct', { onAddProduct: handleAddProduct })}
        >
          <Text style={styles.buttonText}>+ Add New Product</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  profileName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  floatingCartIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FF5722',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  chatIcon: {
    backgroundColor: '#1E88E5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#4CAF50',
  },
  productQuantity: {
    fontSize: 14,
    marginBottom: 10,
    color: '#777',
  },
  productButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
});