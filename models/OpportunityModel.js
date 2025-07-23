import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  // Core details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['job', 'scholarship', 'mentorship', 'funding', 'internship'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },

  // Provider details
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerName: {
    type: String,
    required: true,
    trim: true
  },

  // Location and format
  location: {
    type: String,
    required: true,
    trim: true
  },
  isRemote: {
    type: Boolean,
    default: false
  },

  // Compensation
  salary: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    }
  },

  // Requirements
  requirements: {
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      trim: true
    },
    education: {
      type: String,
      trim: true
    },
    languages: {
      type: [String],
      default: []
    }
  },

  // Other opportunity details
  benefits: {
    type: [String],
    default: []
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  duration: {
    type: String,
    trim: true
  },

  // Applicant control
  maxApplicants: Number,
  currentApplicants: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Extra metadata
  tags: {
    type: [String],
    default: []
  },
  attachments: {
    type: [String],
    default: []
  },

  // Contact information
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

// Add indexes for better query performance
OpportunitySchema.index({ type: 1 });
OpportunitySchema.index({ isActive: 1 });
OpportunitySchema.index({ isRemote: 1 });
OpportunitySchema.index({ provider: 1 });
OpportunitySchema.index({ createdAt: -1 });
OpportunitySchema.index({ applicationDeadline: 1 });
OpportunitySchema.index({ location: 1 });
OpportunitySchema.index({ 'requirements.skills': 1 });
OpportunitySchema.index({ tags: 1 });
OpportunitySchema.index({ category: 1 });

// Text index for search functionality
OpportunitySchema.index({ 
  title: 'text', 
  description: 'text', 
  category: 'text' 
});

export default mongoose.model('Opportunity', OpportunitySchema);
