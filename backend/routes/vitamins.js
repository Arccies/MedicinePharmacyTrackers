import express from "express";
import Vitamin from "../models/Vitamin.js";
import { getVitamins, addVitamin, getExpiringVitamins } from "../controllers/vitaminController.js";

const router = express.Router();

// ✅ Get vitamins for a specific user
router.get("/:userId", getVitamins);

// ✅ Add new vitamin
router.post("/", addVitamin);

// ✅ Update vitamin
router.put("/:id", async (req, res) => {
  try {
    const updatedVitamin = await Vitamin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedVitamin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete vitamin
router.delete("/:id", async (req, res) => {
  try {
    await Vitamin.findByIdAndDelete(req.params.id);
    res.json({ message: "Vitamin deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Expiring vitamins route
router.get("/expiring/:userId", getExpiringVitamins);

export default router;
