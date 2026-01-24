import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },

    type: {
      type: String,
      enum: ["commit", "file_change", "refactor"],
      required: true,
    },

    commitHash: {
      type: String,
    },

    message: {
      type: String,
    },

    filesChanged: {
      type: Number,
      default: 0,
    },

    additions: {
      type: Number,
      default: 0,
    },

    deletions: {
      type: Number,
      default: 0,
    },

    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const activityModel = mongoose.model("activity", activitySchema);

export default activityModel;
