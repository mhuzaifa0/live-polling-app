import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    options: [optionSchema],
    voters: [{ type: String }], // stores hashed ip+slug to prevent duplicate votes
    expiresAt: { type: Date, default: null },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
