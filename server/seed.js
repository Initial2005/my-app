const mongoose = require('mongoose');
const Certificate = require('./models/Certificate');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/myapp';

async function getConnectionUri() {
  try {
    // test connect
    await mongoose.connect(MONGO_URL);
    await mongoose.connection.close();
    return MONGO_URL;
  } catch (err) {
    console.warn('Local Mongo not available, starting in-memory MongoDB for seeding');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    return mongod.getUri();
  }
}

async function seed() {
  const uri = await getConnectionUri();
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  await Certificate.deleteMany({});

  const data = [
    { title: 'Intro to Blockchain', recipient: 'Alice', issuer: 'PSIT' },
    { title: 'Advanced React', recipient: 'Bob', issuer: 'PSIT' },
    { title: 'Data Structures', recipient: 'Carol', issuer: 'PSIT' }
  ];

  const docs = await Certificate.insertMany(data);
  console.log('Seeded', docs.length, 'certificates');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
