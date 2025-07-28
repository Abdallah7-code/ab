const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  specialty: { 
    type: String, 
    required: [true, 'التخصص مطلوب'],
    enum: ['كهرباء', 'سباكة', 'تكييف', 'نجارة', 'أخرى'],
    default: 'أخرى'
  },
  email: { 
    type: String, 
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صالح']
  },
  phone: { 
    type: String, 
    required: [true, 'رقم الهاتف مطلوب'],
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'رقم الهاتف غير صالح']
  },
  rating: { 
    type: Number, 
    default: 0,
    min: [0, 'التقييم لا يمكن أن يكون أقل من 0'],
    max: [5, 'التقييم لا يمكن أن يكون أكثر من 5']
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number], // [longitude, latitude]
    address: String
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'يجب أن يرتبط الفني بحساب مستخدم']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// فهرس للموقع الجغرافي (مفيد إذا أردت البحث عن فنيين قريبين)
technicianSchema.index({ location: '2dsphere' });

// Virtual لحساب متوسط التقييمات (إذا كان لديك نموذج منفصل للتقييمات)
technicianSchema.virtual('averageRating').get(function() {
  // يمكنك استبدال هذا بمنطق حساب التقييم من نموذج التقييمات
  return this.rating;
});

module.exports = mongoose.model('Technician', technicianSchema);