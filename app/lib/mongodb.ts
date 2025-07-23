import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any)._mongoClientPromise = client.connect();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
