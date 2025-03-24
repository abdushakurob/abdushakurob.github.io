import mongoose from "mongoose";
import slugify from "slugify";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    category: { type: String, default: "Uncategorized" },
    link: { type: String }, // Deployed project link
    github: { type: String }, // GitHub repo link
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug
ProjectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
