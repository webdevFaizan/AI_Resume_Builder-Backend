import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Listen for a successful connection
        mongoose.connection.on('connected', () => {
            console.log("Database connected successfully.");
        });
        
        let MONGODB_URI = process.env.MONGODB_URI;
        const projectName = "Resume_Builder_Backend_DB";

        if (!MONGODB_URI) {
            console.log("MongoDB URI is not available.");
            return; // Exit early if URI is not available
        }

        // Connect to the database with the proper URI
        await mongoose.connect(`${MONGODB_URI}/${projectName}`);

    } catch (error) {
        console.log("MongoDB connection failed: " + error);
    }
};

export default connectDB;