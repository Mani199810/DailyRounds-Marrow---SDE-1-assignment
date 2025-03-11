import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    googleId: String,
},{
    collection: "User",
    timestamps: true
});

export default mongoose.model("User", UserSchema);
