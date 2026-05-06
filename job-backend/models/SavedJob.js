const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    savedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

savedJobSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobSchema, "saved_jobs");
