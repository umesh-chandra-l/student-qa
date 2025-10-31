import mongoose from "mongoose";
const QuestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: [String], index: true, default: [] },
  media: { type: [String], default: [] }
}, { timestamps: true });
export default mongoose.model("Question", QuestionSchema);
