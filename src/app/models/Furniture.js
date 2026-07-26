const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FurnitureSchema = new Schema({
  name: { type: String, maxLength: 255, required: true },
  description: { type: String, maxLength: 600, required: true },
  image: { type: String, maxLength: 255, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Furniture', FurnitureSchema);
