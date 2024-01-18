const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLengt: 6 },
});
AuthSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Auth", AuthSchema);
