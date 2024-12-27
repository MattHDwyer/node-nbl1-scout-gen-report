import mongoose from "mongoose";

export const dbConnect = async () => {
  return mongoose
    .connect(
      `mongodb+srv://doadmin:${process.env.MONGO_PW}@db-mongodb-syd1-57206-3bf870ea.mongo.ondigitalocean.com/ausproscout?replicaSet=db-mongodb-syd1-57206&tls=true&authSource=admin`
    )
    .then(() => {
      console.log("Connected to MongoDB 🎉");
    })
    .catch((err) => console.error(err));
};
