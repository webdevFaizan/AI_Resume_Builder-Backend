import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connect" , ()=> {
            console.log("Database connected successfully.")
        });
    
        let MONGODB_URI = process.env.MONGODB_URI;
        const projectName = "Resume_Builder_Backend_DB";
    
        if(!MONGODB_URI){
            console.log("Mongo DB Uri is not available.");
        }
    
        await mongoose.connect(`${MONGODB_URI}/${projectName}`);

        console.log("Connection established successfully");
    }
    catch(error){
        console.log("Mongo DB connection failed " + error )
    }
}

export default connectDB;