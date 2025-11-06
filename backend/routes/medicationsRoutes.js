import express from "express";
import Medication from "../models/Medication.js";

const router = express.Router();

// ✅ Get expiring medications (must come BEFORE /user/:userId)
router.get("/expiring/:userId", async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const expiring = await Medication.find({
      userId: req.params.userId,
      dateStop: { $gte: today, $lte: tomorrow },
    });

    res.json(expiring);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get medications by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const meds = await Medication.find({ userId: req.params.userId });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add new medication
router.post("/", async (req, res) => {
  const { userId, name, dose, takenFor, frequency, timesTaken, dateStop } = req.body;

  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    const newMed = new Medication({
      userId,
      name,
      dose,
      takenFor,
      frequency,
      timesTaken,
      dateStop,
    });

    await newMed.save();
    res.status(201).json(newMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update medication
router.put("/:id", async (req, res) => {
  try {
    const updatedMed = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMed) return res.status(404).json({ message: "Medication not found" });
    res.json(updatedMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete medication
router.delete("/:id", async (req, res) => {
  try {
    const deletedMed = await Medication.findByIdAndDelete(req.params.id);
    if (!deletedMed) return res.status(404).json({ message: "Medication not found" });
    res.json({ message: "Medication deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
