const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    externalJobId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    stipend: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: true,
    },
    applicationLink: String,
    source: {
      type: String,
      enum: ["manual", "adzuna", "jsearch", "multiple-apis"],
      default: "manual",
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ deadline: 1 });

module.exports = mongoose.model("Job", jobSchema, "jobs");
