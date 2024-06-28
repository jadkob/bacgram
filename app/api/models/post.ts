import mongoose from "mongoose";
import { bacgram } from "../setup";

const postSchema = new mongoose.Schema({
    username: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: String,
    text: String,
    likes: { type: Number, default: 0},
    likedUsers: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    views: { type: Number, default: 0},
    viewedUsers: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }],
    createdAt: { type: Date, default: Date.now }
})

export const Post = bacgram.model("Post", postSchema)