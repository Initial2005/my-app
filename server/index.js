const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const Certificate = require('./models/Certificate');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/myapp';

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected to', MONGO_URL);
  } catch (err) {
    console.warn('Failed to connect to', MONGO_URL, '- falling back to in-memory MongoDB');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
  }
}

connectMongo().catch(err => console.error('Mongo connection error', err));

app.get('/api/certificates', async (req, res) => {
  const items = await Certificate.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

app.post('/api/certificates', async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
