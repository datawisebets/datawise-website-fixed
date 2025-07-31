import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI API configuration
const OPENAI_API_KEY = ''YOUR_OPENAI_API_KEY'-D5BFvQk1CpAX4-bUYvGWh-88MZuuDWM9dHExqcEXCOPp0ELLa23w5PB9vwTa23RpY87QU0mdAiT3BlbkFJPGcPAwUNxM6-t2RTg5Q-x76eKVRNZPM-iDeexPxdLhq2rpk6vfL0dblB47GBmDxKNNngOyAb4A';

// Professional stock photo style prompts
const imageConfigs = [
  {
    name: 'moneyline-betting-hero',
    prompt: 'Professional stock photo: Close-up of hands holding a smartphone displaying sports betting odds, blurred stadium lights in background, cinematic depth of field, golden hour lighting, high-end commercial photography style, clean and modern aesthetic, 4K quality, shot on professional camera',
    size: '1792x1024',
    filename: 'moneyline-betting-professional.png'
  },
  {
    name: 'bankroll-management-pro',
    prompt: 'Professional stock photo: Modern minimalist desk setup with calculator, neat stacks of coins, financial planning notebook, and a small elegant piggy bank, soft natural window lighting, shallow depth of field, clean white background, commercial photography style, organized and professional atmosphere, shot from above at 45-degree angle',
    size: '1792x1024',
    filename: 'bankroll-management-professional.png'
  },
  {
    name: 'point-spread-stadium-pro',
    prompt: 'Professional stock photo: Wide angle view of modern NFL stadium interior during golden hour, empty seats creating leading lines, perfectly manicured field with visible yard lines, dramatic sky visible through open roof, architectural photography style, ultra sharp details, professional sports venue photography',
    size: '1792x1024',
    filename: 'point-spread-stadium-professional.png'
  },
  {
    name: 'betting-odds-mobile-pro',
    prompt: 'Professional stock photo: Business person in sharp suit holding latest iPhone displaying colorful sports betting app interface, clean office environment, shallow depth of field focusing on phone screen, modern corporate photography style, bright and professional lighting, high-end commercial aesthetic',
    size: '1792x1024',
    filename: 'sports-betting-odds-professional.png'
  },
  {
    name: 'dfs-comparison-pro',
    prompt: 'Professional stock photo: Two latest model smartphones on clean white surface, displaying different fantasy sports apps with vibrant interfaces, perfect symmetry, product photography style with soft shadows, ultra-clean minimalist background, commercial tech photography, perfect lighting, shot from directly above',
    size: '1792x1024',
    filename: 'dfs-comparison-professional.png'
  }
];

// Function to generate image using OpenAI API with gpt-image-1
async function generateImage(config) {
  console.log(`\n🎨 Generating professional image: ${config.name}...`);
  console.log(`📝 Prompt: ${config.prompt.substring(0, 100)}...`);
  
  const data = JSON.stringify({
    model: 'dall-e-3',  // Using DALL-E 3 for high quality
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
            console.error(`❌ Error generating ${config.name}:`, response.error.message);
            reject(response.error);
            return;
          }

          if (response.data && response.data[0] && response.data[0].url) {
            const imageUrl = response.data[0].url;
            console.log(`✅ Successfully generated ${config.name}`);
            
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
      console.error(`❌ Request error for ${config.name}:`, error);
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
        console.log(`💾 Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Convert to WebP
async function convertToWebP(pngFilename) {
  const webpFilename = pngFilename.replace('.png', '.webp');
  console.log(`🔄 Converting ${pngFilename} to WebP...`);
  
  try {
    const { execSync } = await import('child_process');
    execSync(`cwebp -q 90 "public/images/blog/${pngFilename}" -o "public/images/blog/${webpFilename}"`, {
      stdio: 'pipe'
    });
    console.log(`✅ Converted to ${webpFilename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to convert ${pngFilename} to WebP:`, error.message);
    return false;
  }
}

// Main function to generate all images
async function generateAllImages() {
  console.log('🚀 Starting professional stock photo generation for blog articles...');
  console.log('🎯 Using model: gpt-image-1\n');
  
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'blog');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];

  for (const config of imageConfigs) {
    try {
      await generateImage(config);
      
      // Convert to WebP immediately after generation
      const converted = await convertToWebP(config.filename);
      
      results.push({
        name: config.name,
        filename: config.filename,
        webp: converted ? config.filename.replace('.png', '.webp') : null,
        status: 'success'
      });
      
      console.log(`✅ Completed: ${config.name}\n`);
      
      // Wait 3 seconds between requests to avoid rate limiting
      if (imageConfigs.indexOf(config) < imageConfigs.length - 1) {
        console.log('⏳ Waiting 3 seconds before next image...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`❌ Failed: ${config.name}`, error.message, '\n');
      results.push({
        name: config.name,
        filename: config.filename,
        status: 'failed',
        error: error.message
      });
    }
  }

  // Summary
  console.log('\n📊 Generation Summary:');
  console.log('====================');
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ ${result.name}`);
      console.log(`   PNG: ${result.filename}`);
      if (result.webp) {
        console.log(`   WebP: ${result.webp}`);
      }
    } else {
      console.log(`❌ ${result.name} - ${result.error}`);
    }
  });

  console.log('\n📝 Next steps:');
  console.log('1. Review the generated images in public/images/blog/');
  console.log('2. Update blog post frontmatter with the new WebP filenames');
  console.log('3. Delete old/unused images after confirming new ones are better');
  console.log('4. Consider running them through an optimizer like imageoptim.com');
}

// Run the script
generateAllImages().catch(console.error);