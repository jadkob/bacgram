import mongoose, { mongo } from "mongoose";
import { bacgram } from "../setup";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    likedPosts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }],
    followers: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: "Post"
    }],
    viewedPosts: [{
        type: mongoose.Types.ObjectId,
        ref: "Post",
        default: []
    }]
})

export const User = bacgram.model("User", userSchema)