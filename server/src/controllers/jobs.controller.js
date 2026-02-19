import Job from "../models/Job.js";

function parseTags(tags) {
  if (typeof tags === "string") {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return Array.isArray(tags) ? tags : [];
}

function parseDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function create(req, res) {
  try {
    const body = req.body;
    if (!body.title?.trim()) return res.status(400).json({ message: "Job title is required" });
    if (!body.jobRole?.trim()) return res.status(400).json({ message: "Job role is required" });
    if (!body.description?.trim()) return res.status(400).json({ message: "Job description is required" });

    const job = await Job.create({
      title: body.title.trim(),
      tags: parseTags(body.tags),
      jobRole: body.jobRole.trim(),
      minSalary: body.minSalary != null ? Number(body.minSalary) : undefined,
      maxSalary: body.maxSalary != null ? Number(body.maxSalary) : undefined,
      salaryType: body.salaryType?.trim(),
      educationLevel: body.educationLevel?.trim(),
      experienceLevel: body.experienceLevel?.trim(),
      jobType: body.jobType?.trim(),
      jobLevel: body.jobLevel?.trim(),
      expirationDate: parseDate(body.expirationDate),
      country: body.country?.trim(),
      city: body.city?.trim(),
      fullyRemote: !!body.fullyRemote,
      description: body.description.trim(),
      createdBy: req.userId,
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function list(req, res) {
  try {
    const jobs = await Job.find({ createdBy: req.userId, isDeleted: false }).sort({ createdAt: -1 }).lean();
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.userId, isDeleted: false }).lean();
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function remove(req, res) {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function update(req, res) {
  try {
    const body = req.body;
    if (!body.title?.trim()) return res.status(400).json({ message: "Job title is required" });
    if (!body.jobRole?.trim()) return res.status(400).json({ message: "Job role is required" });
    if (!body.description?.trim()) return res.status(400).json({ message: "Job description is required" });

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      {
        title: body.title.trim(),
        tags: parseTags(body.tags),
        jobRole: body.jobRole.trim(),
        minSalary: body.minSalary != null ? Number(body.minSalary) : undefined,
        maxSalary: body.maxSalary != null ? Number(body.maxSalary) : undefined,
        salaryType: body.salaryType?.trim() || undefined,
        educationLevel: body.educationLevel?.trim() || undefined,
        experienceLevel: body.experienceLevel?.trim() || undefined,
        jobType: body.jobType?.trim() || undefined,
        jobLevel: body.jobLevel?.trim() || undefined,
        expirationDate: parseDate(body.expirationDate),
        country: body.country?.trim() || undefined,
        city: body.city?.trim() || undefined,
        fullyRemote: !!body.fullyRemote,
        description: body.description.trim(),
      },
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
