import mongoose from 'mongoose';
import { logger } from './Logger';

// Singleton wrapper around the Mongoose connection.
// Using a static instance ensures only one connection is opened for the lifetime of the process.
export class MyDB {
    static DB: MyDB = new MyDB();

    async connectToDb(): Promise<void> {
        const URI = process.env.MONGO_URI!;
        try {
            await mongoose.connect(URI);
            console.log('Connected to MongoDB Atlas...');
            logger.info('Connected to database successfully.');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
    }

    static getDB(): MyDB {
        // readyState === 0 means 'disconnected'; only connect if not already connected
        if (mongoose.connection.readyState === 0)
            this.DB.connectToDb();
        return this.DB;
    }
}
