import mongoose from "mongoose";
import slugify from "slugify";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    content: { type: String }, // ✅ For detailed write-ups
    coverImage: { type: String },
    tags: [{ type: String }],
    category: { type: String, default: "Uncategorized" },
    link: { type: String },
    github: { type: String },
    isFeatured: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: { type: Date },
    manualDate: { type: Date }, // For projects that happened in the past
    customLinks: [{
      title: { type: String, required: true },
      url: { type: String, required: true },
      icon: { type: String }
    }]
  },
  { timestamps: true }
);

// Auto-generate slug and handle publishing
ProjectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  // Set publishedAt date when project is first published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
