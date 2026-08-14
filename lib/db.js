import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Missing MongoDB_URI in .env");
}

//on serverless platform 
let catched = global.mongooseConn;

//Global cache
if(!catched){
    catched = global.mongooseConn = { conn: null, promise: null };
}

export async function connectDB(){

    
    if(catched.conn){   //Quick Exit if already connected
        return catched.conn;
    }

    if(!catched.promise){   //The Race Condition Preventer
        catched.promise = mongoose.connect(MONGODB_URI,{ bufferCommands: false})
        .then((m) => m);
    }

    const conn = await catched.promise;
    catched.conn = conn;
    return conn;
}