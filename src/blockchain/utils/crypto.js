/**
 * crypto.js - Cryptographic utilities for PSIT Coin blockchain
 * Implements SHA-256 hashing and key generation
 */

/**
 * SHA-256 hash function (simplified implementation)
 * In production, use crypto-js or similar library
 * @param {string} message - The message to hash
 * @returns {string} The hash
 */
export function SHA256(message) {
  // For development, we'll use a simple hash function
  // In production, import from 'crypto-js' or use native crypto API

  // Simple hash function for demonstration
  // You should install and use crypto-js for production
  let hash = 0;
  if (message.length === 0) return hash.toString(16);

  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to hex and pad
  const hexHash = Math.abs(hash).toString(16).padStart(16, "0");

  // Make it longer to simulate SHA-256 (64 characters)
  return hexHash.repeat(4).substring(0, 64);
}

/**
 * Generate a random wallet address
 * @param {string} prefix - Prefix for the address (default: 'PSIT')
 * @returns {string} A random wallet address
 */
export function generateWalletAddress(prefix = "PSIT") {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let address = prefix + "_";

  for (let i = 0; i < 32; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return address;
}

/**
 * Generate a key pair (simplified)
 * In production, use proper elliptic curve cryptography
 * @returns {object} Public and private key pair
 */
export function generateKeyPair() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);

  const privateKey = SHA256(timestamp + random + "private");
  const publicKey = SHA256(timestamp + random + "public");

  return {
    privateKey,
    publicKey,
    address: generateWalletAddress(),
  };
}

/**
 * Validate wallet address format
 * @param {string} address - The address to validate
 * @returns {boolean} True if valid
 */
export function isValidAddress(address) {
  // Check if address starts with PSIT_ and has correct length
  return address && address.startsWith("PSIT_") && address.length === 37;
}
