import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    repoName: {
      type: String,
      required: true,
      minlength: [2, "Repository name must be at least 2 characters"],
    },

    repoUrl: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Repository URL is invalid"],
    },

    status: {
      type: String,
      enum: ["pending", "analyzing", "verified", "flagged"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const projectModel = mongoose.model("project", projectSchema);

export default projectModel;
