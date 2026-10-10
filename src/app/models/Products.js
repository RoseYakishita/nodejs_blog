const mongoose = require('mongoose');

mongoose.plugin(require('mongoose-slug-updater'));

const mongooseDelete = require('mongoose-delete');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
      maxlength: [200, 'Tên sản phẩm không quá 200 ký tự'],
    },

    slug: {
      type: String,
      slug: 'name',
      unique: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá bán'],
      min: [0, 'Giá bán không thể âm'],
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng tồn kho'],
      min: [0, 'Tồn kho không thể âm'],
      default: 0,
    },

    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=300',
      ],
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['active', 'draft', 'out_of_stock'],
      default: 'active',
    },

    variants: [
      {
        size: String,
        color: String,
        stock: Number,
        price: Number,
      },
    ],
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

productSchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true,
});

productSchema.virtual('formattedPrice').get(function () {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(this.price || 0);
});

productSchema.virtual('image').get(function () {
  return this.images && this.images.length > 0
    ? this.images[0]
    : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=300';
});

module.exports = mongoose.model('Product', productSchema);
