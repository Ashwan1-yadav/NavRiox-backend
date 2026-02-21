const imageProcessor = require("../../utils/imageProcessor");

exports.processPassport = async (inputPath, bgColor) => {
  return await imageProcessor.generateA4Sheet(inputPath, bgColor);
};