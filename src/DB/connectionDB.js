import mongoose from "mongoose";
export const connectionDB = async () => {
  await mongoose.connect(process.env.MONGO_URL , {
      serverSelectionTimeoutMS: 3000,
    })
    .then(() => {
      console.log("Data base connected successfully");
    })
    .catch((err) => {
      console.log("Data base connection failed", err);
    });
};
