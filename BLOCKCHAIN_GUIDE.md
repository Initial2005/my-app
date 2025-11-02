# PSIT Coin Blockchain - Implementation Guide

## 🎯 Overview

PSIT Coin is a custom blockchain-based reward system integrated into the BrainChainPSIT learning platform. Students earn PSIT Coins by solving coding problems, which can be spent at the cafeteria, tuckshop, or used to boost internal marks.

## 🏗️ Architecture

### Core Components

```
src/blockchain/
├── Block.js                 # Blockchain block implementation
├── Transaction.js           # Transaction handling
├── PSITCoinBlockchain.js   # Main blockchain class
├── Wallet.js               # User wallet management
├── index.js                # Module exports
└── utils/
    └── crypto.js           # Cryptographic utilities
```

### UI Components

```
src/components/
├── PSITCoinWallet.js       # User wallet interface
├── PSITCoinWallet.css      # Wallet styling
├── AdminDashboard.js       # Admin monitoring panel
├── AdminDashboard.css      # Admin styling
└── Problems.js (updated)   # Integrated with blockchain
```

## 🔑 Key Features

### 1. **Blockchain Core**
- **Proof of Work (PoW)**: Mining difficulty of 2 (configurable)
- **Block Structure**: Timestamp, transactions, previous hash, nonce
- **Chain Validation**: Cryptographic integrity verification
- **Persistent Storage**: LocalStorage-based blockchain persistence

### 2. **Smart Reward System**
Problems are rewarded based on difficulty:
- 🟢 **Easy**: 10 PSIT Coins
- 🟡 **Medium**: 25 PSIT Coins
- 🔴 **Hard**: 50 PSIT Coins

### 3. **Transaction Types**
- **Reward**: System awards coins for problem completion
- **Purchase**: Users spend coins at vendors
- **Mining Reward**: Blockchain miners earn coins
- **Transfer**: Peer-to-peer coin transfers (future)

### 4. **Wallet Features**
- Unique wallet address generation
- Public/private key pair
- Transaction history
- Balance tracking
- Wallet backup/export

### 5. **Admin Dashboard**
- Real-time blockchain monitoring
- Transaction notifications
- User activity tracking
- Blockchain integrity verification
- Statistics and analytics

## 🚀 How It Works

### Student Flow

1. **Wallet Creation**
   ```javascript
   // Automatic wallet creation on first use
   const wallet = new Wallet(userRollNo, userName);
   ```

2. **Solve Problems**
   - Student selects and solves a coding problem
   - CodeEditor verifies solution against test cases
   - On successful submission...

3. **Earn Coins**
   ```javascript
   blockchain.awardCoinsForProblem(
     userWallet.address,
     problem.difficulty,
     problemDetails
   );
   ```

4. **Mine Block**
   ```javascript
   blockchain.minePendingTransactions(userWallet.address);
   ```

5. **Spend Coins**
   - Open wallet interface
   - Select purchase option (cafeteria/tuckshop/marks)
   - Transaction recorded on blockchain

### Admin Flow

1. **Monitor Rewards**
   - Admin dashboard shows real-time notifications
   - Each coin award triggers admin notification
   - View user stats and blockchain health

2. **Verify Integrity**
   ```javascript
   const isValid = blockchain.isChainValid();
   ```

## 📊 Data Structures

### Block Structure
```javascript
{
  timestamp: 1730476800000,
  transactions: [
    {
      fromAddress: null,  // System reward
      toAddress: "PSIT_abc123...",
      amount: 25,
      type: "reward",
      metadata: {
        problemId: 4,
        problemTitle: "Maximum Subarray",
        difficulty: "Medium",
        platform: "LeetCode"
      }
    }
  ],
  previousHash: "0000abc...",
  nonce: 12345,
  hash: "0000def..."
}
```

### Wallet Structure
```javascript
{
  userId: "23CS101",
  userName: "Vaishnavi",
  address: "PSIT_xYz789...",
  publicKey: "abc123...",
  privateKey: "def456..." // Never expose!
}
```

## 🔐 Security Features

1. **Cryptographic Hashing**: SHA-256 for block and transaction hashing
2. **Proof of Work**: Prevents spam and ensures blockchain integrity
3. **Transaction Signing**: Private key signatures (simplified implementation)
4. **Balance Verification**: Prevents spending more than available
5. **Chain Validation**: Continuous integrity checks

## 💻 Integration Examples

### Award Coins When Problem Solved

```javascript
// In Problems.js
const handleProblemSolved = (problem) => {
  const blockchain = getBlockchain();
  const userWallet = new Wallet(userRollNo, userName);
  
  // Award coins
  blockchain.awardCoinsForProblem(
    userWallet.address,
    problem.difficulty,
    problem
  );
  
  // Mine pending transactions
  blockchain.minePendingTransactions(userWallet.address);
  
  // Update UI
  const newBalance = blockchain.getBalanceOfAddress(userWallet.address);
  alert(`Earned ${rewardAmount} PSIT Coins! New balance: ${newBalance}`);
};
```

### Check User Balance

```javascript
const balance = blockchain.getBalanceOfAddress(walletAddress);
console.log(`Current balance: ${balance} PSIT Coins`);
```

### Get User Statistics

```javascript
const stats = blockchain.getUserStats(walletAddress);
// Returns:
// {
//   balance: 150,
//   totalEarned: 175,
//   totalSpent: 25,
//   problemsSolved: {
//     easy: 5,
//     medium: 3,
//     hard: 1,
//     total: 9
//   },
//   transactionCount: 12
// }
```

### Process a Purchase

```javascript
blockchain.processPurchase(
  userAddress,
  vendorAddress,
  50, // amount
  {
    item: "Sandwich",
    vendor: "Cafeteria",
    purchaseDate: new Date().toISOString()
  },
  userPrivateKey
);

blockchain.minePendingTransactions(userAddress);
```

## 📱 UI Components

### PSITCoinWallet Component

```javascript
import PSITCoinWallet from './components/PSITCoinWallet';

<PSITCoinWallet
  userSettings={userSettings}
  onClose={() => setShowWallet(false)}
/>
```

**Features:**
- Balance display
- Transaction history
- Spending options
- Wallet backup/export
- Real-time updates

### AdminDashboard Component

```javascript
import AdminDashboard from './components/AdminDashboard';

<AdminDashboard />
```

**Features:**
- Blockchain statistics
- Real-time notifications
- User activity monitoring
- Integrity verification
- Reward structure display

## 🔄 Blockchain Lifecycle

```
1. User solves problem
   ↓
2. Create reward transaction
   ↓
3. Add to pending transactions
   ↓
4. Mine pending transactions
   ↓
5. Create new block with PoW
   ↓
6. Add block to chain
   ↓
7. Validate blockchain
   ↓
8. Save to localStorage
   ↓
9. Notify admins
   ↓
10. Update UI
```

## 🎨 Customization

### Change Mining Difficulty

```javascript
// In PSITCoinBlockchain.js constructor
this.difficulty = 3; // Increase for harder mining
```

### Modify Reward Amounts

```javascript
// In PSITCoinBlockchain.js
this.rewardMapping = {
  'easy': 15,    // Change from 10
  'medium': 35,  // Change from 25
  'hard': 75     // Change from 50
};
```

### Add New Transaction Types

```javascript
// Create custom transaction
const customTx = new Transaction(
  fromAddress,
  toAddress,
  amount,
  'custom_type',
  { customData: 'value' }
);
```

## 📈 Future Enhancements

1. **Backend Integration**
   - Node.js/Express API
   - MongoDB for blockchain storage
   - WebSocket for real-time updates

2. **Advanced Features**
   - Peer-to-peer transfers
   - Smart contracts
   - Token staking
   - NFT certificates

3. **Mobile App**
   - React Native wallet app
   - QR code payments
   - Push notifications

4. **Vendor Integration**
   - POS system for cafeteria/tuckshop
   - Real-time inventory
   - Receipt generation

5. **Analytics**
   - Student engagement metrics
   - Coin circulation analysis
   - Problem difficulty optimization

## 🐛 Troubleshooting

### Blockchain Not Persisting

**Issue**: Data lost on page refresh

**Solution**: Check browser's localStorage quota
```javascript
// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage not available');
}
```

### Balance Not Updating

**Issue**: Balance shows incorrect value

**Solution**: Clear localStorage and reinitialize
```javascript
localStorage.removeItem('psitCoinBlockchain');
window.location.reload();
```

### Mining Takes Too Long

**Issue**: Blocks take minutes to mine

**Solution**: Reduce difficulty
```javascript
blockchain.difficulty = 1; // Faster mining
```

## 📚 API Reference

### Blockchain Methods

- `awardCoinsForProblem(address, difficulty, problemDetails)`: Award coins
- `processPurchase(userAddress, vendorAddress, amount, details, key)`: Process payment
- `getBalanceOfAddress(address)`: Get wallet balance
- `getUserStats(address)`: Get user statistics
- `minePendingTransactions(rewardAddress)`: Mine pending transactions
- `isChainValid()`: Verify blockchain integrity
- `getBlockchainStats()`: Get overall statistics

### Wallet Methods

- `createWallet()`: Generate new wallet
- `saveWallet()`: Save to localStorage
- `loadWallet()`: Load from localStorage
- `exportWallet()`: Export wallet data
- `signTransaction(transaction)`: Sign a transaction

## 🤝 Contributing

This blockchain implementation is educational and can be extended. Key areas for contribution:

1. Enhanced cryptography
2. Consensus algorithms
3. Network layer
4. Smart contracts
5. Security improvements

## 📝 License

This project is part of the BrainChainPSIT platform and is intended for educational purposes at PSIT.

## 🙏 Acknowledgments

- Inspired by Bitcoin and Ethereum blockchain architectures
- Built for PSIT students to gamify learning
- Integrates with LeetCode/HackerRank style problems

---

**Happy Coding! Earn those PSIT Coins! 🪙**
