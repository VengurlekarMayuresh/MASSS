const Provider = require('../models/Provider');

// @desc    Get all healthcare providers
// @route   GET /api/providers
// @access  Public
const getAllProviders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      specialty, 
      area, 
      search,
      emergency,
      featured,
      verified
    } = req.query;

    // Build filter object
    const filter = { active: true };
    
    if (type) filter.type = type;
    if (specialty) filter.specialty = { $regex: specialty, $options: 'i' };
    if (area) filter['address.area'] = { $regex: area, $options: 'i' };
    if (emergency === 'true') filter.emergencyServices = true;
    if (featured === 'true') filter.featured = true;
    if (verified === 'true') filter.verified = true;

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const providers = await Provider.find(filter)
      .sort({ featured: -1, ratings: { average: -1 }, verified: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews'); // Don't include reviews in list view

    // Get total count for pagination
    const total = await Provider.countDocuments(filter);

    res.json({
      success: true,
      count: providers.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: providers
    });

  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching providers'
    });
  }
};

// @desc    Get single healthcare provider
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('reviews.userId', 'profile.firstName profile.lastName profilePicture');

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Healthcare provider not found'
      });
    }

    res.json({
      success: true,
      data: provider
    });

  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching provider'
    });
  }
};

// @desc    Search providers by location and specialty
// @route   GET /api/providers/search
// @access  Public
const searchProviders = async (req, res) => {
  try {
    const { 
      query, 
      area, 
      specialty, 
      type, 
      emergency,
      page = 1,
      limit = 20
    } = req.query;

    // Build search filter
    const filter = { active: true };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { specialty: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (area) filter['address.area'] = { $regex: area, $options: 'i' };
    if (specialty) filter.specialty = { $regex: specialty, $options: 'i' };
    if (type) filter.type = type;
    if (emergency === 'true') filter.emergencyServices = true;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute search
    const providers = await Provider.find(filter)
      .sort({ ratings: { average: -1 }, verified: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews');

    // Get total count
    const total = await Provider.countDocuments(filter);

    res.json({
      success: true,
      count: providers.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: providers
    });

  } catch (error) {
    console.error('Error searching providers:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while searching providers'
    });
  }
};

// @desc    Get providers by area (Mumbai neighborhoods)
// @route   GET /api/providers/area/:area
// @access  Public
const getProvidersByArea = async (req, res) => {
  try {
    const { area } = req.params;
    const { type, specialty, page = 1, limit = 15 } = req.query;

    const filter = { 
      active: true,
      'address.area': { $regex: area, $options: 'i' }
    };

    if (type) filter.type = type;
    if (specialty) filter.specialty = { $regex: specialty, $options: 'i' };

    const skip = (page - 1) * limit;

    const providers = await Provider.find(filter)
      .sort({ ratings: { average: -1 }, verified: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews');

    const total = await Provider.countDocuments(filter);

    res.json({
      success: true,
      area: area,
      count: providers.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: providers
    });

  } catch (error) {
    console.error('Error fetching providers by area:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching providers by area'
    });
  }
};

// @desc    Get provider categories and counts
// @route   GET /api/providers/categories
// @access  Public
const getProviderCategories = async (req, res) => {
  try {
    const categories = await Provider.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          averageRating: { $avg: '$ratings.average' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching provider categories:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching provider categories'
    });
  }
};

// @desc    Get popular areas in Mumbai
// @route   GET /api/providers/areas/popular
// @access  Public
const getPopularAreas = async (req, res) => {
  try {
    const areas = await Provider.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$address.area',
          count: { $sum: 1 },
          types: { $addToSet: '$type' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: areas
    });

  } catch (error) {
    console.error('Error fetching popular areas:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching popular areas'
    });
  }
};

// @desc    Add review to provider
// @route   POST /api/providers/:id/reviews
// @access  Private
const addProviderReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const providerId = req.params.id;
    const userId = req.user.id; // From auth middleware

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found'
      });
    }

    // Check if user already reviewed this provider
    const existingReview = provider.reviews.find(
      review => review.userId.toString() === userId
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this provider'
      });
    }

    // Add review
    provider.reviews.push({
      userId,
      rating,
      comment
    });

    await provider.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: provider
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adding review'
    });
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  searchProviders,
  getProvidersByArea,
  getProviderCategories,
  getPopularAreas,
  addProviderReview
};


