const express = require('express');
const router = express.Router();

// Simple test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Provider routes working!' });
});

// Basic routes without complex parameters
router.get('/', (req, res) => {
  res.json({ message: 'All providers endpoint' });
});

router.get('/search', (req, res) => {
  res.json({ message: 'Search providers endpoint' });
});

router.get('/categories', (req, res) => {
  res.json({ message: 'Provider categories endpoint' });
});

router.get('/areas/popular', (req, res) => {
  res.json({ message: 'Popular areas endpoint' });
});

// Parameterized routes
router.get('/area/:area', (req, res) => {
  res.json({ message: `Providers in area: ${req.params.area}` });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Provider with ID: ${req.params.id}` });
});

module.exports = router;
