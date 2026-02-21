const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

exports.generateA4Sheet = async (inputPath, bgColor = "#ffffff") => {
  const passportWidth = 390;
  const passportHeight = 480;
  const borderSize = 5;

  const processedPhotoPath = path.join(
    "src/output",
    `processed-${Date.now()}.png`
  );

  await sharp(inputPath)
    .resize(passportWidth, passportHeight, { fit: "cover" })
    .flatten({ background: bgColor }) 
    .png()
    .toFile(processedPhotoPath);

  const a4Width = 2480;
  const a4Height = 3508;

  const canvas = createCanvas(a4Width, a4Height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, a4Width, a4Height);

  const img = await loadImage(processedPhotoPath);

  const totalPhotos = 6;
  const gap = 10;
  const topMargin = 80;

  const totalWidth =
    totalPhotos * (passportWidth + borderSize * 2) +
    (totalPhotos - 1) * gap;

  let startX = (a4Width - totalWidth) / 2;
  let startY = topMargin;

  for (let i = 0; i < totalPhotos; i++) {
    const x = startX + i * (passportWidth + borderSize * 2 + gap);
    const y = startY;

    ctx.fillStyle = "#000000";
    ctx.fillRect(
      x,
      y,
      passportWidth + borderSize * 2,
      passportHeight + borderSize * 2
    );

    ctx.drawImage(
      img,
      x + borderSize,
      y + borderSize,
      passportWidth,
      passportHeight
    );
  }

  const finalPath = path.join(
    "src/output",
    `a4-${Date.now()}.jpg`
  );

  const buffer = canvas.toBuffer("image/jpeg", { quality: 1 });
  fs.writeFileSync(finalPath, buffer);

  return finalPath;
};