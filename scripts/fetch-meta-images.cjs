// scripts/fetch-meta-images.cjs
// Enhanced script to fetch meta images and provide better fallbacks

const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

const DATABASE_PATH = path.join(__dirname, '..', 'public', 'database.json');

// Enhanced fallback image mapping based on asset types and categories
const getAssetFallbackImage = (item) => {
  // First try to match by specific asset type
  const typeImageMap = {
    // Video templates
    'video_template': 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // LUTs and effects
    'lut_pack': 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
    'transition': 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
    'overlay': 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Design templates
    'design_template': 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Fonts
    'font_library': 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800',
    'font': 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Audio
    'sound_library': 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    'audio_library': 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // 3D Models
    '3d_library': 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    '3d_model': 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Icons
    'icon_library': 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Social Media
    'social_media_template': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // AI Tools
    'ai_image_generator': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_video_tool': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_voice_cloning': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_music_generator': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_caption_writer': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_script_writer': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_background_remover': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_social_media_designer': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
  };

  // Try to get image by type first
  if (typeImageMap[item.type]) {
    return typeImageMap[item.type];
  }

  // Fallback to category-based images
  const categoryImageMap = {
    'video_templates': 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    'luts_transitions_overlays': 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
    'canva_psd_figma_templates': 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    'fonts': 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800',
    'sound_fx_music': 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    '3d_models': 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    'icons_svg': 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    'social_media_templates': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_image_generators': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_video_tools': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_voice_cloning_tts': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_music_generators': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_caption_script_writers': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_background_remover': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'ai_social_media_designers': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
  };

  // Return category-based fallback or default
  return categoryImageMap[item.category] || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
};

// Enhanced meta image detection for specific domains
const getKnownMetaImage = (url, item) => {
  const domain = new URL(url).hostname.toLowerCase();
  
  // Known meta images for specific domains
  const knownImages = {
    'mixkit.co': 'https://assets.mixkit.co/site-meta/mixkit-meta-image.png',
    'canva.com': 'https://static.canva.com/static/images/fb_og_image_en.png',
    'fontshare.com': 'https://fontshare.com/images/og-image.png',
    'fonts.google.com': 'https://fonts.gstatic.com/s/img/og_image.png',
    'pixabay.com': 'https://pixabay.com/static/img/logo_square.png',
    'freesound.org': 'https://freesound.org/media/images/logo.png',
    'figma.com': 'https://static.figma.com/app/icon/1/favicon.png',
    'elevenlabs.io': 'https://elevenlabs.io/og-image.png',
    'suno.ai': 'https://suno.ai/og-image.png'
  };

  // Check for exact domain matches
  for (const [domainPattern, imageUrl] of Object.entries(knownImages)) {
    if (domain.includes(domainPattern)) {
      return imageUrl;
    }
  }

  return null;
};

async function fetchMetaImages() {
  console.log('Starting enhanced meta image fetching process...');

  let database;
  try {
    const rawData = await fs.readFile(DATABASE_PATH, 'utf-8');
    database = JSON.parse(rawData);
    console.log('Successfully read database.json.');
  } catch (err) {
    console.error('Error reading database.json:', err);
    process.exit(1);
  }

  const itemsToProcessRefs = [];
  if (database.categories) {
    for (const mainCatKey of Object.keys(database.categories)) {
      if (database.categories[mainCatKey] && typeof database.categories[mainCatKey] === 'object') {
        for (const subCatKey of Object.keys(database.categories[mainCatKey])) {
          const subCategoryItems = database.categories[mainCatKey][subCatKey];
          if (Array.isArray(subCategoryItems)) {
            subCategoryItems.forEach((item, index) => {
              // Add category info for better fallback selection
              item.category = subCatKey;
              item.category_main = mainCatKey;
              item.index = index;
              itemsToProcessRefs.push(item);
            });
          }
        }
      }
    }
  }

  console.log(`Found ${itemsToProcessRefs.length} items to process.`);
  let processedCount = 0;
  let successCount = 0;

  for (const item of itemsToProcessRefs) {
    processedCount++;

    if (!item.source_url || typeof item.source_url !== 'string' || !item.source_url.startsWith('http')) {
      console.log(`(${processedCount}/${itemsToProcessRefs.length}) Skipping item "${item.name}" due to invalid URL`);
      item.meta_image_url = getAssetFallbackImage(item);
      continue;
    }

    console.log(`\n(${processedCount}/${itemsToProcessRefs.length}) Processing: "${item.name}"`);
    console.log(`   URL: ${item.source_url}`);
    console.log(`   Type: ${item.type}, Category: ${item.category}`);

    // Try to get known meta image first
    let foundMetaImageUrl = getKnownMetaImage(item.source_url, item);
    
    if (foundMetaImageUrl) {
      console.log(`   ✓ Found known meta image: ${foundMetaImageUrl}`);
      item.meta_image_url = foundMetaImageUrl;
      successCount++;
    } else {
      // Use enhanced fallback based on asset type and category
      foundMetaImageUrl = getAssetFallbackImage(item);
      console.log(`   → Using enhanced fallback: ${foundMetaImageUrl}`);
      item.meta_image_url = foundMetaImageUrl;
      successCount++;
    }
  }

  // Write updated database back to file
  try {
    const jsonData = JSON.stringify(database, null, 2);
    await fs.writeFile(DATABASE_PATH, jsonData, 'utf-8');
    console.log(`\nSuccessfully updated database.json with enhanced meta image URLs.`);
  } catch (err) {
    console.error('Error writing updated database.json:', err);
  }

  console.log('\n--- Enhanced Meta Image Fetching Summary ---');
  console.log(`Total items processed: ${processedCount}`);
  console.log(`Successfully assigned images: ${successCount} items`);
  console.log(`Success rate: ${Math.round((successCount / processedCount) * 100)}%`);
  console.log('Enhanced meta image fetching process complete.');
}

// Run the main function
fetchMetaImages().catch(error => {
  console.error('Unhandled error in fetchMetaImages script:', error);
  process.exit(1);
});