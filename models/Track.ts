import mongoose from "mongoose";
import slugify from "slugify";

const TrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["Branding", "Web Dev", "Learning", "Other"], default: "Other" },
    updates: [
      {
        title: String,
        content: String,
        date: { type: Date, default: Date.now },
      },
    ],
    milestones: [
      {
        title: String,
        achieved: { type: Boolean, default: false },
        date: Date,
      },
    ],
    links: [{ type: String }],
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug
TrackSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.Track || mongoose.model("Track", TrackSchema);
