import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// On serverless platform
let catched = global.mongooseConn;

// Global cache
if (!catched) {
    catched = global.mongooseConn = {
        conn: null,
        promise: null
    };
}

export async function connectDB() {

    if (!MONGODB_URI) {
        throw new Error("Missing MONGODB_URI environment variable");
    }

    if (catched.conn) {
        return catched.conn;
    }

    if (!catched.promise) {
        catched.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false
            })
            .then((m) => m);
    }

    const conn = await catched.promise;
    catched.conn = conn;

    return conn;
}