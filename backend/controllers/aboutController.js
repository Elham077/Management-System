const About = require("../models/About");

/**
 * Create About
 */
exports.createAbout = async (req, res) => {
  try {
    const { title, desc, imageUrl } = req.body;

    if (!title || !desc || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "fill the Required Data",
      });
    }

    const about = await About.create({
      title,
      desc,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Creating",
      error: error.message,
    });
  }
};

/**
 * Get All About
 */
exports.getAllAbout = async (req, res) => {
  try {
    const abouts = await About.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: abouts.length,
      data: abouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetching Error",
      error: error.message,
    });
  }
};

/**
 * Get Single About
 */
exports.getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "can't find",
      });
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "fetching Error",
      error: error.message,
    });
  }
};

/**
 * Update About
 */
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "There is no Data For updating",
      });
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in updating",
      error: error.message,
    });
  }
};

/**
 * Delete About
 */
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "there is no data for deleting!",
      });
    }

    res.status(200).json({
      success: true,
      message: "About Successfully Delated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetching Data",
      error: error.message,
    });
  }
};
