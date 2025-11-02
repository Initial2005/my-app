/**
 * Wallet.js - User wallet management for PSIT Coin
 * Handles wallet creation, key storage, and transaction signing
 */

import { generateKeyPair } from "./utils/crypto";

class Wallet {
  constructor(userId, userName) {
    this.userId = userId;
    this.userName = userName;
    this.address = null;
    this.publicKey = null;
    this.privateKey = null;

    // Try to load existing wallet
    this.loadWallet();

    // If no wallet exists, create one
    if (!this.address) {
      this.createWallet();
    }
  }

  /**
   * Create a new wallet
   */
  createWallet() {
    const keyPair = generateKeyPair();

    this.address = keyPair.address;
    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;

    this.saveWallet();

    console.log("New wallet created:", this.address);
  }

  /**
   * Save wallet to localStorage
   */
  saveWallet() {
    try {
      const walletData = {
        userId: this.userId,
        userName: this.userName,
        address: this.address,
        publicKey: this.publicKey,
        privateKey: this.privateKey,
        createdAt: Date.now(),
      };

      localStorage.setItem("psitWallet", JSON.stringify(walletData));

      // Also save to user-specific key
      localStorage.setItem(
        `psitWallet_${this.userId}`,
        JSON.stringify(walletData)
      );
    } catch (error) {
      console.error("Error saving wallet:", error);
    }
  }

  /**
   * Load wallet from localStorage
   */
  loadWallet() {
    try {
      // Try user-specific wallet first
      let walletData = localStorage.getItem(`psitWallet_${this.userId}`);

      // Fallback to default wallet
      if (!walletData) {
        walletData = localStorage.getItem("psitWallet");
      }

      if (walletData) {
        const data = JSON.parse(walletData);
        this.address = data.address;
        this.publicKey = data.publicKey;
        this.privateKey = data.privateKey;
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  }

  /**
   * Get wallet details
   * @returns {object} Wallet information (without private key)
   */
  getWalletInfo() {
    return {
      userId: this.userId,
      userName: this.userName,
      address: this.address,
      publicKey: this.publicKey,
    };
  }

  /**
   * Export wallet (for backup)
   * @returns {object} Complete wallet data
   */
  exportWallet() {
    return {
      userId: this.userId,
      userName: this.userName,
      address: this.address,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
      warning:
        "Keep this private key secure! Anyone with this key can access your coins.",
    };
  }

  /**
   * Import wallet from backup
   * @param {object} walletData - Wallet data to import
   */
  importWallet(walletData) {
    this.address = walletData.address;
    this.publicKey = walletData.publicKey;
    this.privateKey = walletData.privateKey;

    this.saveWallet();
  }

  /**
   * Sign a transaction
   * @param {Transaction} transaction - The transaction to sign
   */
  signTransaction(transaction) {
    transaction.signTransaction(this.privateKey);
  }
}

export default Wallet;
