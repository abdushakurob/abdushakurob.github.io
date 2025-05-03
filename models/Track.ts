import mongoose, { Schema, Document, models, Model } from "mongoose";
import slugify from "slugify";

// Interface for the Track document
export interface ITrack extends Document {
  title: string;
  slug: string;
  description?: string;
  content?: string; // Rich text content
  category?: string; // e.g., 'Week', 'Month', 'Project Update'
  tags?: string[];
  status: 'draft' | 'published' | 'archived'; // Added status field
  publishedAt?: Date | null; // Added publishedAt field
  manualDate?: Date; // Added manualDate field
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  updates: Array<{
    title: string;
    content: string;
    date: string;
  }>;
  milestones: Array<{
    title: string;
    achieved: boolean;
    date?: string;
  }>;
  links: string[];
}

// Mongoose Schema for Track
const TrackSchema: Schema<ITrack> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String, // Storing HTML content from Quill
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    // --- New Fields ---
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    manualDate: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    updates: [{
      title: String,
      content: String,
      date: String
    }],
    milestones: [{
      title: String,
      achieved: Boolean,
      date: String
    }],
    links: {
      type: [String],
      default: []
    },
    // --- End New Fields ---
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook to generate slug from title if not provided or changed
TrackSchema.pre<ITrack>("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Set publishedAt when status changes to 'published'
  if (this.isModified("status") && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  } else if (this.status !== 'published') {
    // Optionally clear publishedAt if status is not 'published'
    // this.publishedAt = null; // Uncomment if you want this behavior
  }
  next();
});

// Define the model type explicitly
interface ITrackModel extends Model<ITrack> {}

// Check if the model already exists before defining it
const Track: ITrackModel = models.Track || mongoose.model<ITrack, ITrackModel>("Track", TrackSchema);

export default Track;
