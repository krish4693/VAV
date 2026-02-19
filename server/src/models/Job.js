import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    jobRole: { type: String, required: true, trim: true },
    minSalary: Number,
    maxSalary: Number,
    salaryType: { type: String, trim: true },
    educationLevel: { type: String, trim: true },
    experienceLevel: { type: String, trim: true },
    jobType: { type: String, trim: true },
    jobLevel: { type: String, trim: true },
    expirationDate: Date,
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    fullyRemote: { type: Boolean, default: false },
    description: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
