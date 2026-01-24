import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
      unique: true,
      index: true,
    },

    /**
     * Timeline is generated from Activity records
     * Stored as references for auditability
     */
    timeline: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "activity",
      },
    ],

    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    /**
     * Structured flags for explainable AI output
     */
    flags: [
      {
        code: {
          type: String, // e.g. BULK_COMMIT, LOW_ACTIVITY_SPREAD
        },
        message: {
          type: String, // human readable explanation
        },
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "low",
        },
      },
    ],

    /**
     * Extra context for judges & reports
     */
    summary: {
      type: String, // short explanation of score
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const verificationModel = mongoose.model("verification", verificationSchema);
export default verificationModel;
