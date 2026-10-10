const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.plugin(require('mongoose-slug-updater'));

const FurnitureSchema = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    slug: { type: String, slug: 'name', unique: true },
    description: { type: String, maxLength: 600, required: true },
    images: { type: [String], required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Furniture', FurnitureSchema);
