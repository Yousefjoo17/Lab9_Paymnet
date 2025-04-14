import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from "react-native";
import { initStripe, useStripe, CardField } from '@stripe/stripe-react-native';

export default function CartScreen({ navigation }) {
  // Initialize Stripe when component mounts
  useEffect(() => {
    initStripe({
      publishableKey: 'pk_test_51RDkE0QqKpNZCaWe5S12dUbdKYXHbdt0neMoa0oWcT40BMmpet5CekQ8fSywIFCiilc1NsCVTkgQRKuzzft6RP0B00IDZUvJ4m',
    });
  }, []);

  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // Sample product in the cart
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Laptop',
      description: 'Brand new laptop',
      basePrice: 1000,
      quantity: 1,
      isAuction: false,
      category: 'Electronics',
      imageUrls: ['https://elctoys.qa/cdn/shop/products/215510638_500x.png?v=1675752904'],
    },
  ]);

  const handleIncrease = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Fetch payment intent from your backend
  const fetchPaymentIntent = async (amount) => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: 'Purchase from mobile app',
          currency: 'usd'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const { clientSecret, paymentId } = await response.json();
      return { clientSecret, paymentId };
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      throw error;
    }
  };

  const handleProceedToPayment = () => {
    setShowCardForm(true);
  };

  const handlePayment = async () => {
    try {
      // Validate card details first
      setLoading(true);
      const totalAmount = parseFloat(getTotalPrice());
      
      // Don't process empty carts or zero amounts
      if (cartItems.length === 0 || totalAmount <= 0) {
        Alert.alert('Error', 'Your cart is empty or the total amount is invalid.');
        setLoading(false);
        return;
      }
      
      // Get client secret from backend
      const { clientSecret, paymentId } = await fetchPaymentIntent(totalAmount);
      
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      
      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Success', 'Payment was successful!');
        setCartItems([]); // Clear cart after successful payment
        setShowCardForm(false);
      }
    } catch (error) {
      Alert.alert('Error', `Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.basePrice * item.quantity, 0).toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrls[0] }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.basePrice.toFixed(2)} x {item.quantity}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => handleDecrease(item.id)} style={styles.qtyButton}>
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrease(item.id)} style={styles.qtyButton}>
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
            
            {!showCardForm ? (
              <TouchableOpacity 
                style={styles.checkoutButton} 
                onPress={handleProceedToPayment}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.paymentContainer}>
                <Text style={styles.paymentHeader}>Payment Details</Text>
                
                <CardField
                  postalCodeEnabled={true}
                  placeholders={{
                    number: 'Card Number',
                    expiration: 'MM/YY',
                    cvc: 'CVC',
                    postalCode: 'ZIP',
                  }}
                  cardStyle={styles.cardStyle}
                  style={styles.cardField}
                  onCardChange={cardDetails => {
                    setCardDetails(cardDetails);
                  }}
                />
                
                <View style={styles.paymentStatus}>
                  {cardDetails?.complete ? (
                    <Text style={styles.validCard}>Card is valid</Text>
                  ) : (
                    <Text style={styles.invalidCard}>Complete card details</Text>
                  )}
                </View>
                

                
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handlePayment}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Pay</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#2ecc71',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    backgroundColor: '#ddd',
    padding: 6,
    borderRadius: 4,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginTop: 16,
    paddingBottom: 50,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a8e4be',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
  },
  // Payment form styles
  paymentContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  cardStyle: {
    backgroundColor: '#F8F8F8',
    textColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  paymentStatus: {
    marginBottom: 20,
  },
  validCard: {
    color: '#2ecc71',
    fontSize: 14,
  },
  invalidCard: {
    color: '#e74c3c',
    fontSize: 14,
  },
  payButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});