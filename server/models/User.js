import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true },
  name: String,
  email: { type: String, unique: true },
  profilePic: String,
  achievements: { type: [String], default: [] }
}, { timestamps: true });
export default mongoose.model("User", UserSchema);
