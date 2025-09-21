#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const API_URL = 'https://examtopicsweb-dwgjfcfgdecucahz.northeurope-01.azurewebsites.net/api/Questions';
const IMAGES_DIR = path.join(__dirname, '../src/images/az-204-exam');
const DOWNLOADED_IMAGES_MAP = path.join(__dirname, '../src/images/az-204-exam/image-map.json');

// Utility function to download an image
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const request = client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = require('fs').createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    // Set timeout
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

// Generate a safe filename from URL
function generateSafeFilename(url, questionIndex, imageIndex) {
  const parsedUrl = new URL(url);
  const extension = path.extname(parsedUrl.pathname) || '.png';
  return `q${questionIndex.toString().padStart(3, '0')}_img${imageIndex.toString().padStart(2, '0')}${extension}`;
}

// Main function to process all images
async function processExamImages() {
  try {
    console.log('🚀 Starting AZ-204 exam image download process...');

    // Ensure images directory exists
    await fs.mkdir(IMAGES_DIR, { recursive: true });

    // Fetch questions data
    console.log('📡 Fetching questions from API...');
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const questions = await response.json();
    console.log(`✅ Loaded ${questions.length} questions`);

    // Process images
    const imageMap = {};
    let totalImages = 0;
    let downloadedImages = 0;
    let skippedImages = 0;

    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const question = questions[questionIndex];
      const questionNumber = `Q${(questionIndex + 1).toString().padStart(3, '0')}`;

      if (question.images && Array.isArray(question.images) && question.images.length > 0) {
        console.log(`\n📷 Processing images for ${questionNumber} (${question.images.length} images)`);

        imageMap[questionNumber] = {
          originalImages: question.images,
          localImages: []
        };

        for (let imageIndex = 0; imageIndex < question.images.length; imageIndex++) {
          const imageUrl = question.images[imageIndex];
          totalImages++;

          if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
            console.log(`   ⚠️  Skipping empty image URL for ${questionNumber}`);
            skippedImages++;
            continue;
          }

          try {
            const safeFilename = generateSafeFilename(imageUrl, questionIndex + 1, imageIndex + 1);
            const localPath = path.join(IMAGES_DIR, safeFilename);
            const relativePath = `../images/az-204-exam/${safeFilename}`;

            // Check if file already exists
            try {
              await fs.access(localPath);
              console.log(`   ✅ Image already exists: ${safeFilename}`);
              imageMap[questionNumber].localImages.push({
                originalUrl: imageUrl,
                localPath: relativePath,
                filename: safeFilename
              });
              continue;
            } catch {
              // File doesn't exist, proceed with download
            }

            console.log(`   ⬇️  Downloading: ${imageUrl}`);
            console.log(`   💾 Saving as: ${safeFilename}`);

            await downloadImage(imageUrl, localPath);

            imageMap[questionNumber].localImages.push({
              originalUrl: imageUrl,
              localPath: relativePath,
              filename: safeFilename
            });

            downloadedImages++;
            console.log(`   ✅ Successfully downloaded: ${safeFilename}`);

            // Add a small delay to be respectful to the server
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error) {
            console.log(`   ❌ Failed to download ${imageUrl}: ${error.message}`);
            skippedImages++;

            // Add placeholder for failed downloads
            imageMap[questionNumber].localImages.push({
              originalUrl: imageUrl,
              localPath: null,
              filename: null,
              error: error.message
            });
          }
        }
      }
    }

    // Save image mapping
    await fs.writeFile(DOWNLOADED_IMAGES_MAP, JSON.stringify(imageMap, null, 2));

    console.log('\n🎉 Image download process completed!');
    console.log('📊 Summary:');
    console.log(`   Total images found: ${totalImages}`);
    console.log(`   Successfully downloaded: ${downloadedImages}`);
    console.log(`   Skipped/Failed: ${skippedImages}`);
    console.log(`   Questions with images: ${Object.keys(imageMap).length}`);
    console.log(`   Image map saved to: ${DOWNLOADED_IMAGES_MAP}`);

    // Generate statistics
    const stats = {
      totalQuestions: questions.length,
      questionsWithImages: Object.keys(imageMap).length,
      totalImages,
      downloadedImages,
      skippedImages,
      imageMap: Object.keys(imageMap).reduce((acc, key) => {
        acc[key] = {
          originalCount: imageMap[key].originalImages.length,
          downloadedCount: imageMap[key].localImages.filter(img => img.localPath).length
        };
        return acc;
      }, {}),
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(IMAGES_DIR, 'download-stats.json'),
      JSON.stringify(stats, null, 2)
    );

    console.log('📈 Statistics saved to download-stats.json');

  } catch (error) {
    console.error('❌ Error processing exam images:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  processExamImages();
}

module.exports = { processExamImages };