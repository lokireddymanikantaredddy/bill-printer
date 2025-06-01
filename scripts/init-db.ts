const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fertilizer:fertilizer@cluster0.fi3ezm3.mongodb.net/fertilizer?retryWrites=true&w=majority&appName=Cluster0';

async function initializeDB() {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    if (!connection.connection.db) {
      throw new Error('Database connection not established');
    }

    const db = connection.connection.db;

    // Create collections if they don't exist
    await db.createCollection('users');
    await db.createCollection('inventory');
    await db.createCollection('bills');

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('bills').createIndex({ billNumber: 1 }, { unique: true });
    await db.collection('inventory').createIndex({ name: 1 });

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDB(); 