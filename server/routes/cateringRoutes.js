const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/cateringController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getPackages)
  .post(protect, adminOnly, createPackage);

router.route('/:id')
  .get(getPackageById)
  .put(protect, adminOnly, updatePackage)
  .delete(protect, adminOnly, deletePackage);

module.exports = router;

