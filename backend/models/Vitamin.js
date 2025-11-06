import mongoose from "mongoose";

const vitaminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  selectedType: {
    type: String,
    required: true,
  },
  selectedName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Vitamin = mongoose.model("Vitamin", vitaminSchema);

export default Vitamin;
