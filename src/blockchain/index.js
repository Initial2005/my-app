/**
 * index.js - Blockchain module exports
 * Central export point for PSIT Coin blockchain
 */

import PSITCoinBlockchain from "./PSITCoinBlockchain";
import Block from "./Block";
import Transaction from "./Transaction";
import Wallet from "./Wallet";
import {
  SHA256,
  generateWalletAddress,
  generateKeyPair,
  isValidAddress,
} from "./utils/crypto";

// Create singleton instance of blockchain
let blockchainInstance = null;

/**
 * Get the blockchain instance (singleton pattern)
 * @returns {PSITCoinBlockchain} The blockchain instance
 */
export const getBlockchain = () => {
  if (!blockchainInstance) {
    blockchainInstance = new PSITCoinBlockchain();
  }
  return blockchainInstance;
};

/**
 * Initialize blockchain with admin addresses
 * @param {Array<string>} adminAddresses - List of admin addresses
 */
export const initializeBlockchain = (adminAddresses = []) => {
  const blockchain = getBlockchain();
  adminAddresses.forEach((addr) => blockchain.registerAdmin(addr));
  return blockchain;
};

export {
  PSITCoinBlockchain,
  Block,
  Transaction,
  Wallet,
  SHA256,
  generateWalletAddress,
  generateKeyPair,
  isValidAddress,
};

export default getBlockchain;
