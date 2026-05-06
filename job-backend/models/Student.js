const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional for Google Login users
  },
  college: {
    type: String,
  },
  graduationYear: {
    type: Number,
  },
  degree: {
    type: String,
  },
  branch: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  resumeUploaded: {
    type: Boolean,
    default: false,
  },
  profileComplete: {
    type: Number,
    default: 85,
  },
});

module.exports = mongoose.model("Student", studentSchema);
