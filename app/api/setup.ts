import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017")

export const bacgram = mongoose.connection.useDb("bacgram")