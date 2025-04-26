// src/services/EnhancedImageService.js
// Enhanced version of ImageService with preloading capabilities

import ImageService from './ImageService';

// Create a cache to store preloaded images
const imageCache = new Map();

// Enhanced service with additional features
const EnhancedImageService = {
  // Include all original methods from the base service
  ...ImageService,
  
  // Preload a single image and store in cache
  preloadImage: (type, id) => {
    return new Promise((resolve, reject) => {
      const imagePath = ImageService.getImage(type, id);
      const cacheKey = `${type}:${id}`;
      
      // Skip if already in cache
      if (imageCache.has(cacheKey)) {
        resolve(imagePath);
        return;
      }
      
      // Create a new image and load it
      const img = new Image();
      img.onload = () => {
        imageCache.set(cacheKey, img);
        resolve(imagePath);
      };
      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${type}/${id}`));
      };
      img.src = imagePath;
    });
  },
  
  // Preload multiple images of the same type
  preloadImages: (type, ids) => {
    const promises = ids.map(id => EnhancedImageService.preloadImage(type, id));
    return Promise.all(promises);
  },
  
  // Preload common images used throughout the app
  preloadCommonAssets: async () => {
    const commonAssets = {
      character: Object.keys(ImageService.characterAvatars).filter(key => key !== 'default'),
      card: Object.keys(ImageService.cardDesigns).filter(key => key !== 'default'),
      gameMode: Object.keys(ImageService.gameModes).filter(key => key !== 'default'),
      background: ['piltover', 'zaun', 'arcane'], // Most common backgrounds
      pet: ['dragon', 'poro'] // Most common pets
    };
    
    // Preload in order of priority
    try {
      // First load essential game modes
      await EnhancedImageService.preloadImages('gameMode', commonAssets.gameMode);
      
      // Then load character avatars in parallel with cards
      await Promise.all([
        EnhancedImageService.preloadImages('character', commonAssets.character),
        EnhancedImageService.preloadImages('card', commonAssets.card)
      ]);
      
      // Finally load backgrounds and pets
      await Promise.all([
        EnhancedImageService.preloadImages('background', commonAssets.background),
        EnhancedImageService.preloadImages('pet', commonAssets.pet)
      ]);
      
      console.log('All common assets preloaded successfully');
      return true;
    } catch (error) {
      console.error('Error preloading common assets:', error);
      return false;
    }
  },
  
  // Check if an image is already in the cache
  isImageCached: (type, id) => {
    return imageCache.has(`${type}:${id}`);
  },
  
  // Get image dimensions from cache if available
  getImageDimensions: (type, id) => {
    const cacheKey = `${type}:${id}`;
    if (imageCache.has(cacheKey)) {
      const img = imageCache.get(cacheKey);
      return { width: img.width, height: img.height };
    }
    return null; // Not cached yet
  },
  
  // Clear specific images from cache
  clearImageFromCache: (type, id) => {
    const cacheKey = `${type}:${id}`;
    if (imageCache.has(cacheKey)) {
      imageCache.delete(cacheKey);
      return true;
    }
    return false;
  },
  
  // Clear all images from cache
  clearCache: () => {
    imageCache.clear();
    console.log('Image cache cleared');
  },
  
  // Get statistics about the cache
  getCacheStats: () => {
    const stats = {
      totalImages: imageCache.size,
      byType: {}
    };
    
    // Count images by type
    for (const key of imageCache.keys()) {
      const type = key.split(':')[0];
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    }
    
    return stats;
  }
};

export default EnhancedImageService;