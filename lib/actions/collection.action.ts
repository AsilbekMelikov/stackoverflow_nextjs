import { connectToDatabase } from "../mongoose";

export const questionCollection = async () => {
  try {
    connectToDatabase();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
