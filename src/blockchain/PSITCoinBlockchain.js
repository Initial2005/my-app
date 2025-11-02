/**
 * PSITCoinBlockchain.js - Main blockchain class for PSIT Coin
 * Manages the blockchain, transactions, and coin rewards
 */

import Block from "./Block";
import Transaction from "./Transaction";

class PSITCoinBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Mining difficulty
    this.pendingTransactions = [];
    this.miningReward = 10; // Default mining reward
    this.adminAddresses = []; // List of admin addresses for notifications

    // Problem difficulty to coin reward mapping
    this.rewardMapping = {
      easy: 10,
      medium: 25,
      hard: 50,
    };

    // Load blockchain from localStorage if available
    this.loadFromStorage();
  }

  /**
   * Create the genesis (first) block
   * @returns {Block} The genesis block
   */
  createGenesisBlock() {
    const genesisTransaction = new Transaction(
      null,
      "PSIT_SYSTEM",
      0,
      "genesis",
      {
        message:
          "PSIT Coin Genesis Block - Empowering Education Through Blockchain",
      }
    );
    return new Block(Date.now(), [genesisTransaction], "0");
  }

  /**
   * Get the latest block in the chain
   * @returns {Block} The latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new transaction to pending transactions
   * @param {Transaction} transaction - The transaction to add
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    // Check if sender has enough balance (except for system rewards)
    if (transaction.fromAddress !== null) {
      const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);
      if (senderBalance < transaction.amount) {
        throw new Error("Insufficient balance");
      }
    }

    this.pendingTransactions.push(transaction);

    // Notify admins if it's a reward transaction
    if (transaction.type === "reward") {
      this.notifyAdmins(transaction);
    }
  }

  /**
   * Mine pending transactions and add them to the blockchain
   * @param {string} miningRewardAddress - Address to receive mining reward
   */
  minePendingTransactions(miningRewardAddress) {
    // Create mining reward transaction
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward,
      "mining_reward",
      { blockNumber: this.chain.length }
    );

    this.pendingTransactions.push(rewardTx);

    // Create new block with pending transactions
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    // Reset pending transactions
    this.pendingTransactions = [];

    // Save to localStorage
    this.saveToStorage();
  }

  /**
   * Award coins to a user for completing a problem
   * @param {string} userAddress - User's wallet address
   * @param {string} difficulty - Problem difficulty (easy/medium/hard)
   * @param {object} problemDetails - Details about the problem
   * @returns {Transaction} The reward transaction
   */
  awardCoinsForProblem(userAddress, difficulty, problemDetails) {
    const rewardAmount = this.rewardMapping[difficulty.toLowerCase()] || 10;

    const rewardTransaction = new Transaction(
      null, // System generated
      userAddress,
      rewardAmount,
      "reward",
      {
        problemId: problemDetails.id,
        problemTitle: problemDetails.title,
        difficulty: difficulty,
        platform: problemDetails.platform,
        completedAt: new Date().toISOString(),
      }
    );

    this.addTransaction(rewardTransaction);

    return rewardTransaction;
  }

  /**
   * Process a purchase transaction (cafeteria/tuckshop)
   * @param {string} userAddress - User's wallet address
   * @param {string} vendorAddress - Vendor's wallet address
   * @param {number} amount - Amount to spend
   * @param {object} purchaseDetails - Details about the purchase
   * @param {string} signingKey - User's private key
   */
  processPurchase(
    userAddress,
    vendorAddress,
    amount,
    purchaseDetails,
    signingKey
  ) {
    const purchaseTransaction = new Transaction(
      userAddress,
      vendorAddress,
      amount,
      "purchase",
      purchaseDetails
    );

    purchaseTransaction.signTransaction(signingKey);
    this.addTransaction(purchaseTransaction);

    return purchaseTransaction;
  }

  /**
   * Get the balance of a specific address
   * @param {string} address - The address to check
   * @returns {number} The balance
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    // Include pending transactions
    for (const trans of this.pendingTransactions) {
      if (trans.fromAddress === address) {
        balance -= trans.amount;
      }

      if (trans.toAddress === address) {
        balance += trans.amount;
      }
    }

    return balance;
  }

  /**
   * Get all transactions for a specific address
   * @param {string} address - The address to check
   * @returns {Array} Array of transactions
   */
  getTransactionsForAddress(address) {
    const transactions = [];

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address || trans.toAddress === address) {
          transactions.push({
            ...trans.getDetails(),
            blockHash: block.hash,
            blockTimestamp: block.timestamp,
          });
        }
      }
    }

    return transactions.reverse(); // Most recent first
  }

  /**
   * Get user statistics
   * @param {string} address - The address to check
   * @returns {object} User statistics
   */
  getUserStats(address) {
    const transactions = this.getTransactionsForAddress(address);
    const rewardTransactions = transactions.filter(
      (tx) => tx.type === "reward"
    );
    const purchaseTransactions = transactions.filter(
      (tx) => tx.type === "purchase"
    );

    const problemsSolved = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0,
    };

    rewardTransactions.forEach((tx) => {
      if (tx.metadata && tx.metadata.difficulty) {
        const diff = tx.metadata.difficulty.toLowerCase();
        if (problemsSolved.hasOwnProperty(diff)) {
          problemsSolved[diff]++;
          problemsSolved.total++;
        }
      }
    });

    return {
      balance: this.getBalanceOfAddress(address),
      totalEarned: rewardTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      totalSpent: purchaseTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      problemsSolved,
      transactionCount: transactions.length,
    };
  }

  /**
   * Validate the blockchain
   * @returns {boolean} True if blockchain is valid
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if all transactions are valid
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      // Check if current block's hash is correct
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check if previous hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  /**
   * Register an admin address for notifications
   * @param {string} adminAddress - The admin's address
   */
  registerAdmin(adminAddress) {
    if (!this.adminAddresses.includes(adminAddress)) {
      this.adminAddresses.push(adminAddress);
      this.saveToStorage();
    }
  }

  /**
   * Notify admins about a reward transaction
   * @param {Transaction} transaction - The reward transaction
   */
  notifyAdmins(transaction) {
    const notification = {
      type: "reward",
      transaction: transaction.getDetails(),
      timestamp: Date.now(),
    };

    // In a real application, this would send notifications via email/push
    console.log("Admin Notification:", notification);

    // Store notification in localStorage for admin dashboard
    const notifications = JSON.parse(
      localStorage.getItem("adminNotifications") || "[]"
    );
    notifications.unshift(notification);
    localStorage.setItem(
      "adminNotifications",
      JSON.stringify(notifications.slice(0, 100))
    ); // Keep last 100
  }

  /**
   * Save blockchain to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(
        "psitCoinBlockchain",
        JSON.stringify({
          chain: this.chain,
          pendingTransactions: this.pendingTransactions,
          adminAddresses: this.adminAddresses,
        })
      );
    } catch (error) {
      console.error("Error saving blockchain:", error);
    }
  }

  /**
   * Load blockchain from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem("psitCoinBlockchain");
      if (stored) {
        const data = JSON.parse(stored);
        // Reconstruct blockchain from stored data
        if (data.chain && data.chain.length > 1) {
          this.chain = data.chain.map((blockData) => {
            const block = new Block(
              blockData.timestamp,
              blockData.transactions.map((txData) => {
                const tx = new Transaction(
                  txData.fromAddress,
                  txData.toAddress,
                  txData.amount,
                  txData.type,
                  txData.metadata
                );
                tx.timestamp = txData.timestamp;
                tx.signature = txData.signature;
                return tx;
              }),
              blockData.previousHash
            );
            block.nonce = blockData.nonce;
            block.hash = blockData.hash;
            return block;
          });
        }

        if (data.pendingTransactions) {
          this.pendingTransactions = data.pendingTransactions.map((txData) => {
            const tx = new Transaction(
              txData.fromAddress,
              txData.toAddress,
              txData.amount,
              txData.type,
              txData.metadata
            );
            tx.timestamp = txData.timestamp;
            tx.signature = txData.signature;
            return tx;
          });
        }

        if (data.adminAddresses) {
          this.adminAddresses = data.adminAddresses;
        }
      }
    } catch (error) {
      console.error("Error loading blockchain:", error);
    }
  }

  /**
   * Get blockchain statistics
   * @returns {object} Blockchain statistics
   */
  getBlockchainStats() {
    let totalTransactions = 0;
    let totalRewards = 0;
    let totalPurchases = 0;

    for (const block of this.chain) {
      totalTransactions += block.transactions.length;

      for (const tx of block.transactions) {
        if (tx.type === "reward") {
          totalRewards += tx.amount;
        } else if (tx.type === "purchase") {
          totalPurchases += tx.amount;
        }
      }
    }

    return {
      blockCount: this.chain.length,
      totalTransactions,
      pendingTransactions: this.pendingTransactions.length,
      totalRewardsDistributed: totalRewards,
      totalPurchases,
      difficulty: this.difficulty,
      isValid: this.isChainValid(),
    };
  }
}

export default PSITCoinBlockchain;
