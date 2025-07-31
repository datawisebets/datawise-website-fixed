import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI API configuration
const OPENAI_API_KEY = ''YOUR_OPENAI_API_KEY'-D5BFvQk1CpAX4-bUYvGWh-88MZuuDWM9dHExqcEXCOPp0ELLa23w5PB9vwTa23RpY87QU0mdAiT3BlbkFJPGcPAwUNxM6-t2RTg5Q-x76eKVRNZPM-iDeexPxdLhq2rpk6vfL0dblB47GBmDxKNNngOyAb4A';

// Generate the DFS comparison image
const config = {
  name: 'dfs-comparison',
  prompt: 'Two modern smartphones displaying colorful daily fantasy sports apps side by side, PrizePicks-style purple interface on left, Underdog-style orange interface on right, clean minimal white background, professional product photography, high contrast, sharp focus on screens showing player stats and fantasy lineups',
  size: '1792x1024',
  filename: 'dfs-apps-comparison.png'
};

// Function to generate image using OpenAI API
async function generateImage() {
  console.log(`Generating image: ${config.name}...`);
  
  const data = JSON.stringify({
    model: 'dall-e-3',
    prompt: config.prompt,
    n: 1,
    size: config.size,
    quality: 'hd',
    style: 'natural'
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/images/generations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', async () => {
        try {
          const response = JSON.parse(responseData);
          
          if (response.error) {
            console.error(`Error generating ${config.name}:`, response.error.message);
            reject(response.error);
            return;
          }

          if (response.data && response.data[0] && response.data[0].url) {
            const imageUrl = response.data[0].url;
            console.log(`Successfully generated ${config.name}`);
            console.log(`Image URL: ${imageUrl}`);
            
            // Download the image
            await downloadImage(imageUrl, config.filename);
            resolve(imageUrl);
          } else {
            reject(new Error('No image URL in response'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Request error for ${config.name}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Function to download image from URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '..', 'public', 'images', 'blog', filename);
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Run the script
generateImage()
  .then(() => {
    console.log('\n✅ Image generated successfully!');
    console.log('\nNext step: Convert to WebP format using:');
    console.log(`cwebp -q 85 "public/images/blog/${config.filename}" -o "public/images/blog/${config.filename.replace('.png', '.webp')}"`);
  })
  .catch(console.error);