# PSIT Coin System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PSIT Learning Platform                       │
│                      (React Application)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
           ┌────────▼────────┐    ┌────────▼────────┐
           │  Student View   │    │   Admin View    │
           │                 │    │                 │
           │  • Problems     │    │  • Dashboard    │
           │  • Wallet       │    │  • Notifications│
           │  • Transactions │    │  • Analytics    │
           └────────┬────────┘    └────────┬────────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Blockchain Layer     │
                    │                       │
                    │  PSITCoinBlockchain   │
                    │  • Mining             │
                    │  • Validation         │
                    │  • Transactions       │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Storage Layer       │
                    │                       │
                    │  • localStorage       │
                    │  • Wallet Data        │
                    │  • Blockchain Data    │
                    └───────────────────────┘
```

## Component Interaction Flow

```
┌─────────┐       ┌──────────┐       ┌────────────┐       ┌─────────┐
│ Student │──1──▶ │ Problems │──2──▶ │ CodeEditor │──3──▶ │ Wallet  │
└─────────┘       │Component │       │            │       │         │
                  └──────────┘       └────────────┘       └─────────┘
                       │                    │                   │
                       │                    │                   │
                       4                    5                   6
                       │                    │                   │
                       ▼                    ▼                   ▼
                  ┌──────────────────────────────────────────────┐
                  │         PSIT Coin Blockchain                 │
                  │                                              │
                  │  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
                  │  │  Block 0 │──│  Block 1  │──│  Block 2 │ │
                  │  │ (Genesis)│  │(Rewards)  │  │(Purchase)│ │
                  │  └──────────┘  └───────────┘  └──────────┘ │
                  └──────────────────────────────────────────────┘
                                    │
                                    7
                                    │
                                    ▼
                  ┌──────────────────────────────┐
                  │      Admin Dashboard         │
                  │  • Real-time notifications   │
                  │  • Blockchain stats          │
                  │  • User activity tracking    │
                  └──────────────────────────────┘

Flow:
1. Student navigates to Problems
2. Selects a problem to solve
3. Writes and submits solution
4. Solution verified by CodeEditor
5. Blockchain awards coins
6. Wallet balance updated
7. Admin receives notification
```

## Transaction Lifecycle

```
╔═══════════════════════════════════════════════════════════════╗
║                    TRANSACTION LIFECYCLE                       ║
╚═══════════════════════════════════════════════════════════════╝

1. CREATION
   ┌─────────────────┐
   │ Problem Solved  │
   │ Easy: 10 coins  │
   │ Med: 25 coins   │
   │ Hard: 50 coins  │
   └────────┬────────┘
            │
            ▼
2. TRANSACTION OBJECT
   ┌─────────────────────────┐
   │ Transaction {           │
   │   from: null (system)   │
   │   to: student_address   │
   │   amount: 25           │
   │   type: 'reward'       │
   │   metadata: {...}      │
   │ }                       │
   └────────┬────────────────┘
            │
            ▼
3. PENDING POOL
   ┌─────────────────────────┐
   │ Pending Transactions    │
   │ • Tx1: +25 coins       │
   │ • Tx2: Mining reward   │
   └────────┬────────────────┘
            │
            ▼
4. MINING (Proof of Work)
   ┌─────────────────────────┐
   │ Calculate hash with     │
   │ increasing nonce until  │
   │ hash starts with '00'   │
   │                         │
   │ nonce: 12345           │
   │ hash: 00abc123...      │
   └────────┬────────────────┘
            │
            ▼
5. NEW BLOCK
   ┌─────────────────────────┐
   │ Block {                 │
   │   transactions: [...]   │
   │   previousHash: '...'   │
   │   nonce: 12345         │
   │   hash: '00abc...'     │
   │ }                       │
   └────────┬────────────────┘
            │
            ▼
6. ADD TO CHAIN
   ┌─────────────────────────┐
   │ Blockchain.chain[]      │
   │ • Genesis              │
   │ • Block 1              │
   │ • Block 2 (NEW!)       │
   └────────┬────────────────┘
            │
            ▼
7. PERSIST & NOTIFY
   ┌─────────────────────────┐
   │ • Save to localStorage  │
   │ • Update student wallet │
   │ • Notify admins        │
   │ • Update UI            │
   └─────────────────────────┘
```

## Wallet Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER WALLET                           │
└─────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
        │ Identification│ │   Keys     │ │   Balance  │
        │               │ │            │ │            │
        │ • User ID     │ │ • Public   │ │ • Current  │
        │ • User Name   │ │ • Private  │ │ • Earned   │
        │ • Address     │ │ • Signature│ │ • Spent    │
        └───────┬──────┘ └─────┬──────┘ └─────┬──────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                        ┌───────▼────────┐
                        │  Transactions  │
                        │                │
                        │  • History     │
                        │  • Pending     │
                        │  • Confirmed   │
                        └────────────────┘
```

## Spending Flow

```
    ┌──────────┐
    │ Student  │
    │ Wallet   │
    │ 50 coins │
    └────┬─────┘
         │
         │ Select Purchase
         │
    ┌────▼──────────────────────────────────────────┐
    │             Spending Options                   │
    │                                                │
    │  ┌─────────┐  ┌──────────┐  ┌──────────────┐ │
    │  │Cafeteria│  │ Tuckshop │  │Internal Marks│ │
    │  │  10+    │  │   15+    │  │    100       │ │
    │  └────┬────┘  └────┬─────┘  └──────┬───────┘ │
    └───────┼────────────┼────────────────┼─────────┘
            │            │                │
            └────────────┼────────────────┘
                         │
                    ┌────▼─────┐
                    │ Purchase │
                    │Transaction│
                    └────┬─────┘
                         │
                    ┌────▼──────┐
                    │ Blockchain│
                    │  Mining   │
                    └────┬──────┘
                         │
                    ┌────▼──────┐
                    │  Balance  │
                    │  Updated  │
                    │ 40 coins  │
                    └───────────┘
```

## Admin Monitoring System

```
┌──────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                        │
└──────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐      ┌──────▼───────┐    ┌─────▼──────┐
   │ Overview │      │Notifications │    │ Blockchain │
   │          │      │              │    │   Info     │
   │ • Stats  │      │ • Real-time  │    │            │
   │ • Charts │      │ • Rewards    │    │ • Blocks   │
   │ • Summary│      │ • Purchases  │    │ • Valid?   │
   └────┬─────┘      └──────┬───────┘    └─────┬──────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                  ┌─────────▼─────────┐
                  │  Blockchain Data  │
                  │                   │
                  │  • Total Rewards  │
                  │  • Total Purchase │
                  │  • Active Users   │
                  │  • Transactions   │
                  └───────────────────┘
```

## Data Flow: Problem Solved → Coins Earned

```
┌──────────────┐
│ Student      │
│ solves       │ 1. Submit Solution
│ "Two Sum"    │────────────┐
│ (Easy)       │            │
└──────────────┘            │
                            ▼
                   ┌────────────────┐
                   │  CodeEditor    │
                   │  • Run tests   │ 2. Verify Solution
                   │  • All pass ✓  │────────────┐
                   └────────────────┘            │
                                                 ▼
                                    ┌────────────────────┐
                                    │ onProblemSolved()  │
                                    │ callback triggered │
                                    └─────────┬──────────┘
                                              │
                                              │ 3. Award Coins
                                              ▼
                                   ┌─────────────────────┐
                                   │ Blockchain          │
                                   │ .awardCoinsFor      │
                                   │ Problem()           │
                                   │                     │
                                   │ Creates Transaction:│
                                   │ • from: system      │
                                   │ • to: student       │
                                   │ • amount: 10        │
                                   └──────────┬──────────┘
                                              │
                                              │ 4. Mine Block
                                              ▼
                                   ┌─────────────────────┐
                                   │ Mining Process      │
                                   │ • PoW calculation   │
                                   │ • Find valid hash   │
                                   │ • Add to chain      │
                                   └──────────┬──────────┘
                                              │
                            ┌─────────────────┼─────────────────┐
                            │                 │                 │
                       5a. Update        5b. Notify        5c. Persist
                            │                 │                 │
                            ▼                 ▼                 ▼
                  ┌──────────────┐   ┌───────────────┐ ┌──────────────┐
                  │ Wallet       │   │ Admin         │ │ localStorage │
                  │ Balance: 10  │   │ Dashboard     │ │ • Blockchain │
                  │ (Updated)    │   │ • Notification│ │ • Wallets    │
                  └──────────────┘   └───────────────┘ └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY STACK                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: Cryptography
├── SHA-256 Hashing
├── Public/Private Keys
└── Transaction Signatures

Layer 2: Proof of Work
├── Mining Difficulty
├── Nonce Calculation
└── Hash Validation

Layer 3: Chain Integrity
├── Block Linking
├── Previous Hash Verification
└── Continuous Validation

Layer 4: Transaction Verification
├── Balance Checks
├── Signature Verification
└── Double-Spend Prevention

Layer 5: Data Persistence
├── localStorage Backup
├── Export/Import
└── Recovery Mechanisms
```

## Future Architecture (Production)

```
┌────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│  • Problems  • Wallet  • Admin Dashboard                   │
└────────────────────────┬───────────────────────────────────┘
                         │
                         │ REST API / WebSocket
                         │
┌────────────────────────▼───────────────────────────────────┐
│                   BACKEND (Node.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Auth Service │  │ Blockchain   │  │ Notification │    │
│  │ (JWT)        │  │ Service      │  │ Service      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────┬───────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
    ┌───────▼──────┐ ┌──▼─────┐ ┌───▼──────┐
    │   MongoDB    │ │ Redis  │ │  Email   │
    │  (Blockchain)│ │(Cache) │ │ Service  │
    └──────────────┘ └────────┘ └──────────┘
            │
            │
    ┌───────▼──────────┐
    │  POS Integration │
    │  • Cafeteria     │
    │  • Tuckshop      │
    └──────────────────┘
```

---

## Legend

```
┌─────┐   ┏━━━━━┓   ╔═════╗
│ Box │   ┃ Bold┃   ║Thick║  = Components
└─────┘   ┗━━━━━┛   ╚═════╝

  │
  ▼     = Flow direction
  
  ─     = Connection

1, 2, 3 = Step numbers
```

---

**This architecture enables:**
- ✅ Scalable blockchain implementation
- ✅ Real-time coin transactions
- ✅ Comprehensive admin monitoring
- ✅ Secure wallet management
- ✅ Future production deployment
