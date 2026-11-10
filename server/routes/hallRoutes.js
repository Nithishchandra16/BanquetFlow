const express = require('express');
const router = express.Router();
const {
  getHalls,
  getHallById,
  checkHallAvailability,
  addHallReview,
  createHall,
  updateHall,
  deleteHall
} = require('../controllers/hallController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getHalls)
  .post(protect, adminOnly, createHall);

router.get('/:id/availability', checkHallAvailability);
router.post('/:id/reviews', protect, addHallReview);

router.route('/:id')
  .get(getHallById)
  .put(protect, adminOnly, updateHall)
  .delete(protect, adminOnly, deleteHall);

module.exports = router;

