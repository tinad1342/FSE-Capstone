import {MongoClient} from "mongodb";
const connectionString = 'mongodb://localhost:27017'; 
export const client = new MongoClient(connectionString);

export async function connect() {
  try {
    await client.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
  } 
}
