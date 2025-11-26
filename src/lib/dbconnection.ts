// import { error } from "console";
import mongoose from "mongoose";

// in express
// mongoose.connect("mongodbURI")

// in nextjs
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("Mongo DB url is not found");
}

let cached = global.mongoose;

if (!cached) {
  global.mongoose = { conn: null, promise: null };
  cached = global.mongoose;
}

const connectdb = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri).then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

export default connectdb;
