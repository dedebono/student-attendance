import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  fullName: { type: String, 
    required: true }, //1
  gender: { type: String, 
    required: true }, //2
  placeOfBirth: { type: String }, //3
  dateOfBirth: { type: Date, required: true }, //4
  familyId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Family', 
    required: true }, //5
  phoneNumber: { type: String }, //6
  address: { type: String }, //7
  bloodType: { type: String }, //8
  hobby: { type: String }, //9
  maritalStatus: { type: String }, //10
  congregationStatus: { type: String }, //11
  familyStatus: { type: String }, //12
  eduHistory: { type: String }, //13
  jobNow: { type: String }, //14
  baptismStatus: { type: String }, //15
  bpjsStatus: { type: String }, //16
  yakumkrisStatus: { type: String }, //17
  isHead: { type: Boolean, default: false }, //18
  email: { type: String },
  role: {
    type: String,
    enum: ['member', 'leader'], 
    default: 'member',
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
  fcmToken: { type: String, default: null },
  password:{
    type:String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePhoto: { type: String }, // store Firebase image URL
}, 
{ timestamps: true });

// Exporting as default
export default mongoose.model('Member', memberSchema);
