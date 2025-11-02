/**
 * Block.js - Core Block class for PSIT Coin blockchain
 * Each block contains transaction data, timestamp, and cryptographic hash
 */

import { SHA256 } from "./utils/crypto";

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate the hash of the block using SHA-256
   * @returns {string} The calculated hash
   */
  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  /**
   * Mine the block with Proof of Work
   * @param {number} difficulty - Number of leading zeros required
   */
  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }

  /**
   * Validate all transactions in the block
   * @returns {boolean} True if all transactions are valid
   */
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

export default Block;
