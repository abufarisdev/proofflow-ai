import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            default: "New User",
        },
        organization: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            default: "Developer",
        },
        bio: {
            type: String,
            default: "",
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        githubUsername: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
