import mongoose from "mongoose";

const medicationSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  dose: { type: String, required: true },
  takenFor: { type: String, required: true },
  frequency: { type: String, required: true },
  timesTaken: { type: String, required: true },
  dateStop: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Medication", medicationSchema);
