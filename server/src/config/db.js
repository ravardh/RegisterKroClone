import mongoose from "mongoose";
import dns from "dns";

const configureDnsServers = () => {
  const servers = ["8.8.8.8", "1.1.1.1"];
  dns.setServers(servers);
};

export const connectDB = async () => {
  try {
    configureDnsServers();
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
