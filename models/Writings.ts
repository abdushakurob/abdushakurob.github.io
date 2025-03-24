import mongoose from "mongoose";
import slugify from "slugify";

const WritingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    category: { type: String, default: "Uncategorized" },
    tags: [{ type: String }],
    excerpt: { type: String },
    coverImage: { type: String },
    author: { type: String, default: "Abdushakur" },
    readingTime: { type: Number },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug, excerpt, and reading time
WritingSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + "...";
  }
  if (!this.readingTime) {
    const words = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200);
  }
  next();
});

export default mongoose.models.Writing || mongoose.model("Writing", WritingSchema);
