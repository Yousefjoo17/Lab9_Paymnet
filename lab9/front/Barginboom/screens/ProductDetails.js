import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetails({ route }) {
  const { product, currentUser } = route.params || {};
  
  // Mock data for interested users and their bids
  const [interestedUsers, setInterestedUsers] = React.useState([
    { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', bidPrice: 850 },
    { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', bidPrice: 900 },
    { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', bidPrice: 820 },
  ]);

  const [currentBid, setCurrentBid] = React.useState(product.basePrice);
  const [bidAmount, setBidAmount] = React.useState('');

  const handlePlaceBid = () => {
    if (!bidAmount || isNaN(bidAmount)) return;
    
    const newBid = parseFloat(bidAmount);
    if (newBid <= currentBid) {
      alert('Your bid must be higher than the current bid!');
      return;
    }

    const isAlreadyInterested = interestedUsers.some(user => user.id === currentUser.id);
    if (!isAlreadyInterested) {
      setInterestedUsers(prev => [
        ...prev,
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatarUrl,
          bidPrice: newBid
        }
      ]);
    } else {
      setInterestedUsers(prev => prev.map(user => 
        user.id === currentUser.id ? {...user, bidPrice: newBid} : user
      ));
    }

    setCurrentBid(newBid);
    setBidAmount('');
  };

  const renderInterestedUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userBid}>${item.bidPrice.toFixed(2)}</Text>
      </View>
      {item.bidPrice === currentBid && (
        <Ionicons name="trophy" size={20} color="gold" style={styles.highestBidIcon} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.imageUrls[0] }} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>
              {product.isAuction ? 'Current Bid:' : 'Price:'}
            </Text>
            <Text style={styles.productPrice}>${currentBid.toFixed(2)}</Text>
          </View>

          {product.isAuction && (
            <View style={styles.auctionInfo}>
              <Text style={styles.auctionEnd}>
                Auction ends: {new Date(product.auctionEnd).toLocaleString()}
              </Text>
              <Text style={styles.bidCount}>
                {interestedUsers.length} {interestedUsers.length === 1 ? 'bid' : 'bids'}
              </Text>
            </View>
          )}
        </View>

        {product.isAuction && (
          <View style={styles.bidSection}>
            <Text style={styles.sectionTitle}>Bidders</Text>
            <FlatList
              data={[...interestedUsers].sort((a, b) => b.bidPrice - a.bidPrice)}
              renderItem={renderInterestedUser}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />

            {currentUser.role === 'buyer' && (
              <View style={styles.bidForm}>
                <TextInput
                  style={styles.bidInput}
                  placeholder="Enter your bid"
                  keyboardType="numeric"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                />
                <TouchableOpacity style={styles.bidButton} onPress={handlePlaceBid}>
                  <Text style={styles.bidButtonText}>Place Bid</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Buy Now Button for non-auction products */}
        {!product.isAuction && currentUser.role === 'buyer' && (
          <TouchableOpacity style={styles.buyNowButton} onPress={() => alert('Purchase successful!')}>
            <Text style={styles.buyNowButtonText}>Buy Now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  productInfo: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 18,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  auctionInfo: {
    marginTop: 8,
  },
  auctionEnd: {
    fontSize: 14,
    color: '#e74c3c',
  },
  bidCount: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 4,
  },
  bidSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userBid: {
    fontSize: 14,
    color: '#2ecc71',
  },
  highestBidIcon: {
    marginLeft: 8,
  },
  bidForm: {
    flexDirection: 'row',
    marginTop: 16,
  },
  bidInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginRight: 8,
  },
  bidButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: 'center',
  },
  bidButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buyNowButton: {
    marginTop: 20,
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
