import mongoose, { ConnectOptions } from "mongoose";
const dbConnection = async () => {
    mongoose.Promise = global.Promise;
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        console.error("MONGO_URL environment variable is not defined.");
        return;
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("Database connection established.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }

    mongoose.connection.on("error", (error: Error) => console.log(error));
};

export default dbConnection;
