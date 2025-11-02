/**
 * Transaction.js - Transaction class for PSIT Coin transfers
 * Handles coin transfers between addresses with signatures
 */

import { SHA256 } from "./utils/crypto";

class Transaction {
  constructor(
    fromAddress,
    toAddress,
    amount,
    type = "transfer",
    metadata = {}
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.type = type; // 'transfer', 'reward', 'purchase'
    this.metadata = metadata; // Additional data (problem details, purchase info, etc.)
    this.timestamp = Date.now();
    this.signature = null;
  }

  /**
   * Calculate the hash of the transaction
   * @returns {string} The calculated hash
   */
  calculateHash() {
    return SHA256(
      this.fromAddress +
        this.toAddress +
        this.amount +
        this.type +
        JSON.stringify(this.metadata) +
        this.timestamp
    ).toString();
  }

  /**
   * Sign the transaction with a private key (simplified)
   * In production, use proper cryptographic signing
   * @param {string} signingKey - The private key
   */
  signTransaction(signingKey) {
    // In a real blockchain, you'd use public-key cryptography
    // For this educational implementation, we'll use a simplified approach
    if (this.fromAddress === null) {
      // Mining reward transaction
      return;
    }

    this.signature = SHA256(signingKey + this.calculateHash()).toString();
  }

  /**
   * Validate the transaction
   * @returns {boolean} True if transaction is valid
   */
  isValid() {
    // Mining rewards come from the system (null address)
    if (this.fromAddress === null) {
      return true;
    }

    // Check if transaction has a signature
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    // Verify the signature (simplified)
    // In production, use proper public-key verification
    return true;
  }

  /**
   * Get transaction details for display
   * @returns {object} Transaction details
   */
  getDetails() {
    return {
      from: this.fromAddress || "SYSTEM",
      to: this.toAddress,
      amount: this.amount,
      type: this.type,
      metadata: this.metadata,
      timestamp: new Date(this.timestamp).toLocaleString(),
      hash: this.calculateHash(),
    };
  }
}

export default Transaction;
