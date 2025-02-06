const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  collegeName: { type: String, required: true }, 
  department: { type: String, required: true }, 
  domainOfInterest: { type: String, required: true }, 
  whatsappNumber: { type: String, required: true }, 
});

module.exports = mongoose.model("User", UserSchema);
