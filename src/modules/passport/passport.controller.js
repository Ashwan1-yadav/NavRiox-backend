const passportService = require("./passport.service");

exports.generatePassport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const bgColor = req.body.bgColor || "#ffffff";

    const outputPath = await passportService.processPassport(
      req.file.path,
      bgColor
    );

    return res.download(outputPath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Passport generation failed",
    });
  }
};