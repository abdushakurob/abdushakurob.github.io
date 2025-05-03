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
    isDraft: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: { type: Date },
    seo: {
      type: {
        title: { type: String },
        description: { type: String },
        keywords: [{ type: String }]
      },
      default: {
        title: '',
        description: '',
        keywords: []
      }
    }
  },
  { timestamps: true }
);

// Auto-generate slug, excerpt, reading time, and handle publishing
WritingSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (!this.excerpt && this.content) {
    // Strip HTML tags and get first 150 characters for excerpt
    const textContent = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = textContent.length > 150 ? textContent.substring(0, 150) + "..." : textContent;
  }

  // Calculate reading time if content changed
  if (this.isModified("content")) {
    const words = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
  }

  // Set publishedAt date when writing is first published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Initialize SEO object if not set
  if (!this.seo) {
    this.seo = {
      title: '',
      description: '',
      keywords: []
    };
  }

  // Auto-generate SEO metadata if not provided
  this.seo.title = this.seo.title || this.title;
  this.seo.description = this.seo.description || this.excerpt || '';
  this.seo.keywords = this.seo.keywords?.length ? this.seo.keywords : this.tags || [];

  next();
});

export default mongoose.models.Writing || mongoose.model("Writing", WritingSchema);
