import express from "express";
import HealthProduct from "../models/HealthProduct.js";

const router = express.Router();

// ✅ Create new health product
router.post("/", async (req, res) => {
  try {
    const { userId, category, name, quantity } = req.body;

    if (!userId || !category || !name || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new HealthProduct({
      userId,
      category,
      name,
      quantity,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// ✅ Get all health products for a user
router.get("/:userId", async (req, res) => {
  try {
    const products = await HealthProduct.find({ userId: req.params.userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// ✅ Update a health product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await HealthProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// ✅ Delete a health product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await HealthProduct.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default router;
