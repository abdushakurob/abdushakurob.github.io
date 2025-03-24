import mongoose from "mongoose";

const NowSchema = new mongoose.Schema(
  {
    focus: [{ type: String }], // Main areas of focus
    learning: [{ type: String }], // Technologies you're exploring
    challenges: [{ type: String }], // Ongoing challenges
    dailyGoals: [{ type: String }], // Daily tasks
    weeklyGoals: [{ type: String }], // Weekly tasks
    monthlyGoals: [{ type: String }], // Monthly tasks
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Now || mongoose.model("Now", NowSchema);
