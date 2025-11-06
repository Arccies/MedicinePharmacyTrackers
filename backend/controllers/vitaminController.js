import Vitamin from "../models/Vitamin.js";

// Get all vitamins
export const getVitamins = async (req, res) => {
  try {
    const vitamins = await Vitamin.find({ userId: req.params.userId });
    res.json(vitamins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a vitamin
export const addVitamin = async (req, res) => {
  try {
    const { userId, selectedType, selectedName, quantity, expirationDate } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const vitamin = new Vitamin({
      userId,
      selectedType,
      selectedName,
      quantity,
      expirationDate,
    });

    await vitamin.save();
    res.status(201).json(vitamin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get expiring vitamins (today or tomorrow)
export const getExpiringVitamins = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const expiringVitamins = await Vitamin.find({
      userId,
      expirationDate: { $gte: today, $lte: tomorrow },
    });

    res.json(expiringVitamins);
  } catch (error) {
    console.error("Error fetching expiring vitamins:", error);
    res.status(500).json({ message: "Error fetching expiring vitamins" });
  }
};
