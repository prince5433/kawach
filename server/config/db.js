import mongoose from "mongoose";
import colors from 'colors';
import dns from 'dns';

const connectDb = async () => {
  try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
      console.log('MongoDB Connection String:', process.env.MONGO_URL); // Log the connection string
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log(`Connected to database ${conn.connection.host}`.bgMagenta.white);
  } catch (err) {
      console.log(`Error in mongoDb ${err}`.bgRed.white);
  }
};

export default connectDb