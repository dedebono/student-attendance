import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  rules: String,
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }
  ]
}, { timestamps: true });

// Export as default
export default mongoose.model('Group', groupSchema);
