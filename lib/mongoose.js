import mongoose from "mongoose";
/**
 * 
 * @returns This function checks if the mongoose connection is already established, and if so, it returns the connection as a promise. If the connection is not established, it retrieves the MongoDB URI from the environment variables and connects to the MongoDB database using the mongoose.connect() method.
 */
export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
  }
}

/**
 * 0 = disconnected
1 = connected
2 = connecting
3 = disconnecting
99 = uninitialized
 */