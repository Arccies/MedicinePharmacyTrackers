import Medication from "../models/Medication.js";

// 🧾 Expiring medications (today or tomorrow)
export const getExpiringMedications = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const expiringMedications = await Medication.find({
      userId,
      expirationDate: { $gte: today, $lte: tomorrow },
    });

    res.json(expiringMedications);
  } catch (error) {
    console.error("Error fetching expiring medications:", error);
    res.status(500).json({ message: "Error fetching expiring medications" });
  }
};
