// import express from 'express';
// import {
//   createOpportunity,
//   getAllOpportunities,
//   getOpportunityById,
//   updateOpportunity,
//   deleteOpportunity,
//   getOpportunitiesByProvider,
//   saveOpportunity,
//   unsaveOpportunity,
//   getSavedOpportunities,
//   updateOpportunityStatus
// } from '../controllers/opportunityController.js';
// import { protect, provider, admin } from '../middleware/authMiddleware.js';
// import upload from '../middleware/uploadMiddleware.js';

// const router = express.Router();

// // Authenticated route (so req.user is available for admin filtering)
// router.get('/', protect, getAllOpportunities);
// router.get('/provider/:providerId', getOpportunitiesByProvider);

// // Saved opportunities routes (Refugees) - must come before /:id routes
// router.get('/saved', protect, getSavedOpportunities);

// // Protected routes (Providers and Admins)
// router.post('/', protect, upload.array('attachments', 5), createOpportunity);

// // Individual opportunity routes - must come after /saved
// router.get('/:id', getOpportunityById);
// router.put('/:id', protect, upload.array('attachments', 5), updateOpportunity);
// router.delete('/:id', protect, deleteOpportunity);
// router.get('/:id/saved', protect, checkIfSaved);
// router.post('/:id/save', protect, saveOpportunity);
// router.delete('/:id/save', protect, unsaveOpportunity);
// router.put('/:id/status', protect, admin, updateOpportunityStatus);

// export default router; 






import express from 'express';
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  checkIfSaved,
  saveOpportunity,
  getSavedOpportunities,
  unsaveOpportunity,
  getOpportunitiesByProvider,
  updateOpportunityStatus
} from '../controllers/opportunityController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);

// Protected routes
router.post('/', protect, upload.array('attachments', 5), createOpportunity);
router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);
router.get('/saved/:userId/:opportunityId', protect, checkIfSaved);
router.post('/save', protect, saveOpportunity);
router.get('/saved', protect, getSavedOpportunities);
router.delete('/:opportunityId/save', protect, unsaveOpportunity);
router.get('/provider/:providerId', getOpportunitiesByProvider);
router.put('/:id/status', protect, updateOpportunityStatus);

export default router;
