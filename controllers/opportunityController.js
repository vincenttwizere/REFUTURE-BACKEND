import SavedOpportunity from '../models/SavedOpportunityModel.js';
import Opportunity from '../models/OpportunityModel.js';

// CREATE a new opportunity
export const createOpportunity = async (req, res) => {
  try {
    // Add provider info from authenticated user
    const opportunityData = {
      ...req.body,
      provider: req.user.id,
      providerName: `${req.user.firstName} ${req.user.lastName}`
    };

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      opportunityData.attachments = req.files.map(file => file.path);
    }

    const opportunity = new Opportunity(opportunityData);
    const savedOpportunity = await opportunity.save();
    
    // Populate provider info for response
    await savedOpportunity.populate('provider', 'firstName lastName email');
    
    res.status(201).json(savedOpportunity);
  } catch (err) {
    console.error('Error creating opportunity:', err);
    res.status(400).json({ error: err.message });
  }
};

// GET all opportunities with optional filters and pagination
export const getAllOpportunities = async (req, res) => {
  try {
    const { type, isRemote, isActive, search, page = 1, limit = 10, category } = req.query;

    const filter = { isActive: true }; // Only show active opportunities by default
    if (type) filter.type = type;
    if (isRemote !== undefined) filter.isRemote = isRemote === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (category) filter.category = category;

    // Text search across title, description, and category
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const opportunities = await Opportunity.find(filter)
      .populate('provider', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Opportunity.countDocuments(filter);

    res.json({
      success: true,
      data: opportunities,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching opportunities:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET a single opportunity by ID
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('provider', 'name email');
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE an opportunity by ID
export const updateOpportunity = async (req, res) => {
  try {
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedOpportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(updatedOpportunity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE an opportunity by ID
export const deleteOpportunity = async (req, res) => {
  try {
    const deleted = await Opportunity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if opportunity is saved by user
export const checkIfSaved = async (req, res) => {
  try {
    const { userId, opportunityId } = req.params;
    const isSaved = await SavedOpportunity.exists({ user: userId, opportunity: opportunityId });
    res.json({ saved: !!isSaved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.body;
    const userId = req.user.id; // Get from authenticated user

    // Check if already saved
    const existing = await SavedOpportunity.findOne({
      user: userId,
      opportunity: opportunityId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Opportunity already saved.' });
    }

    const newSave = new SavedOpportunity({
      user: userId,
      opportunity: opportunityId,
    });

    await newSave.save();
    res.status(201).json({ message: 'Opportunity saved successfully.' });

  } catch (error) {
    // Handle duplicate index error (E11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate save detected.' });
    }
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get saved opportunities for a user
export const getSavedOpportunities = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedOpportunities = await SavedOpportunity.find({ user: userId })
      .populate('opportunity')
      .sort({ createdAt: -1 });
    
    res.json(savedOpportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Unsave an opportunity
export const unsaveOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const userId = req.user.id;

    const deleted = await SavedOpportunity.findOneAndDelete({
      user: userId,
      opportunity: opportunityId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Saved opportunity not found.' });
    }

    res.json({ message: 'Opportunity unsaved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get opportunities by provider
export const getOpportunitiesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const opportunities = await Opportunity.find({ provider: providerId })
      .sort({ createdAt: -1 });
    
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update opportunity status (admin only)
export const updateOpportunityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
