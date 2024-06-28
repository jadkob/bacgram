import mongoose from "mongoose";
import { bacgram } from "../setup";

const commentSchema = new mongoose.Schema({
    username: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    postId: String,
    title: String,
    text: String,
    likes: { type: Number, default: 0},
    likedUsers: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    createdAt: { type: Date, default: Date.now }
})

export const Comment = bacgram.model("Comment", commentSchema)