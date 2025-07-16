import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  option: {
    type: String,
    enum: ['student', 'job seeker', 'undocumented_talent'],
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // ✅ This already creates a unique index
  },
  skills: {
    type: [String],
    default: []
  },
  language: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  document: {
    type: String
  },
  photoUrl: {
    type: String
  },
  supportingDocuments: {
    type: [{
      path: String,
      originalname: String
    }],
    default: []
  },
  education: {
    type: [{
      school: String,
      degree: String,
      field: String,
      start: String,
      end: String,
      duration: String
    }],
    default: []
  },
  experience: {
    type: [{
      company: String,
      title: String,
      type: String,
      start: String,
      end: String,
      duration: String,
      description: String
    }],
    default: []
  },
  highSchoolSubjects: {
    type: String
  },
  desiredField: {
    type: String
  },
  academicRecords: {
    type: [{
      level: String,
      year: String,
      school: String,
      percentage: Number,
      subjectGrades: String,
      certificate: String,
      supportingDocuments: [String]
    }],
    default: []
  },
  talentCategory: {
    type: String,
    enum: ['artist', 'musician', 'programmer', 'writer', 'designer', 'other']
  },
  talentExperience: {
    type: String
  },
  talentDescription: {
    type: String
  },
  portfolio: {
    type: [{
      title: String,
      description: String,
      category: String,
      year: String,
      media: String,
      link: String
    }],
    default: []
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// ✅ Keep these additional indexes (non-conflicting and useful for queries)
ProfileSchema.index({ option: 1 });
ProfileSchema.index({ isPublic: 1 });
ProfileSchema.index({ createdAt: -1 });
ProfileSchema.index({ skills: 1 });
ProfileSchema.index({ currentLocation: 1 });

export default mongoose.model('ProfileModel', ProfileSchema);
