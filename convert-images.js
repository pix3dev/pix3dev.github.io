const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, 'public', 'media');
const images = fs.readdirSync(mediaDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

async function convert() {
  for (const img of images) {
    const inputPath = path.join(mediaDir, img);
    const outputPath = path.join(mediaDir, img.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    if (img.match(/\.webp$/i)) continue;
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`Converted: ${img} -> ${path.basename(outputPath)}`);
    } catch (err) {
      console.error(`Error converting ${img}:`, err.message);
    }
  }
}

convert();
