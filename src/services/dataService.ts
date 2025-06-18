// Data service for transforming the database and providing English translations

export interface DatabaseItem {
  id: string;
  name: string;
  type: string;
  category: string;
  tags: string[];
  description: string;
  source_url: string;
  license_type: string;
  popularity_score: number;
  platform: string;
  thumbnail_url: string;
  category_main: 'creative_assets' | 'ai_tools';
  subcategory: string;
}

export interface DatabaseCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  items: DatabaseItem[];
}

// Translation maps for Hungarian to English
const categoryTranslations: Record<string, string> = {
  'video_templates': 'Video Templates',
  'luts_transitions_overlays': 'LUTs, Transitions & Overlays',
  'canva_psd_figma_templates': 'Design Templates',
  'fonts': 'Fonts',
  'sound_fx_music': 'Audio & Music',
  '3d_models': '3D Models',
  'icons_svg': 'Icons & SVG',
  'social_media_templates': 'Social Media Templates',
  'ai_image_generators': 'AI Image Generators',
  'ai_video_tools': 'AI Video Tools',
  'ai_voice_cloning_tts': 'AI Voice & TTS',
  'ai_music_generators': 'AI Music Generators',
  'ai_face_animator': 'AI Face Animators',
  'ai_caption_script_writers': 'AI Caption & Script Writers',
  'ai_background_remover': 'AI Background Removers',
  'ai_social_media_designers': 'AI Social Media Designers'
};

const categoryDescriptions: Record<string, string> = {
  'video_templates': 'Professional video templates for Premiere Pro, After Effects, and DaVinci Resolve',
  'luts_transitions_overlays': 'Color grading LUTs, smooth transitions, and creative overlays',
  'canva_psd_figma_templates': 'Ready-to-use design templates for Canva, Photoshop, and Figma',
  'fonts': 'High-quality typography and fonts for creative projects',
  'sound_fx_music': 'Royalty-free sound effects and background music',
  '3d_models': '3D models and assets for Blender and other 3D software',
  'icons_svg': 'Scalable vector icons and graphics',
  'social_media_templates': 'Templates optimized for social media platforms',
  'ai_image_generators': 'AI-powered tools for generating images and artwork',
  'ai_video_tools': 'Artificial intelligence tools for video creation and editing',
  'ai_voice_cloning_tts': 'AI voice synthesis and text-to-speech tools',
  'ai_music_generators': 'AI-powered music composition and generation tools',
  'ai_face_animator': 'AI tools for facial animation and deepfake creation',
  'ai_caption_script_writers': 'AI assistants for writing captions and scripts',
  'ai_background_remover': 'AI tools for automatic background removal',
  'ai_social_media_designers': 'AI-powered social media design automation tools'
};

const categoryImages: Record<string, string> = {
  'video_templates': '/images/categories/video-templates.jpg',
  'luts_transitions_overlays': '/images/categories/luts-transitions.jpg',
  'canva_psd_figma_templates': '/images/categories/templates.jpg',
  'fonts': '/images/categories/fonts.jpg',
  'sound_fx_music': '/images/categories/audio.jpg',
  '3d_models': '/images/categories/3d-models.png',
  'icons_svg': '/images/categories/icons.png',
  'social_media_templates': '/images/categories/social-media.jpg',
  'ai_image_generators': '/images/categories/ai-tools.png',
  'ai_video_tools': '/images/categories/ai-tools.png',
  'ai_voice_cloning_tts': '/images/categories/ai-tools.png',
  'ai_music_generators': '/images/categories/ai-tools.png',
  'ai_face_animator': '/images/categories/ai-tools.png',
  'ai_caption_script_writers': '/images/categories/ai-tools.png',
  'ai_background_remover': '/images/categories/ai-tools.png',
  'ai_social_media_designers': '/images/categories/ai-tools.png'
};

// Simple translation function for common descriptions
const translateDescription = (hungarianDesc: string): string => {
  const translations: Record<string, string> = {
    'Retro alakzat animációk keretes címmel': 'Retro shape animations with framed titles',
    'Részecskék vonala a képernyőn keresztül, logó felfedéssel': 'Particle lines across screen with logo reveal',
    'Kreatív modern nyitó sablon': 'Creative modern opener template',
    'Színes parti füst háttér átmenet': 'Colorful party smoke background transition',
    'Professzionális prezentáció sablon': 'Professional presentation template',
    'Dinamikus szöveg animáció': 'Dynamic text animation',
    'Modern logo bemutató': 'Modern logo reveal',
    'Elegáns címsor animáció': 'Elegant title animation',
    'Kreatív átmenet effektus': 'Creative transition effect',
    'Színes LUT csomag': 'Colorful LUT pack',
    'Természetes LUT gyűjtemény': 'Natural LUT collection',
    'Klasszikus film LUT-ok': 'Classic film LUTs',
    'Modern átmenetek': 'Modern transitions',
    'Fény szivárgás effektusok': 'Light leak effects',
    'Overlay effektusok': 'Overlay effects',
    'Részecske effektusok': 'Particle effects',
    'Modern sans-serif betűtípus': 'Modern sans-serif font',
    'Elegáns serif betűtípus': 'Elegant serif font',
    'Kreatív display font': 'Creative display font',
    'Kézzel írott betűtípus': 'Handwritten font',
    'Minimalista betűtípus': 'Minimalist font',
    'Természeti hangok': 'Nature sounds',
    'Háttérzene': 'Background music',
    'Hangeffektusok': 'Sound effects',
    'Chill lo-fi zene': 'Chill lo-fi music',
    'Épület 3D modell': 'Building 3D model',
    'Karakter 3D modell': 'Character 3D model',
    'Bútor 3D modell': 'Furniture 3D model',
    'Minimális ikon szett': 'Minimal icon set',
    'Üzleti ikonok': 'Business icons',
    'Közösségi média ikonok': 'Social media icons',
    'UI/UX ikon csomag': 'UI/UX icon pack',
    'Instagram post sablon': 'Instagram post template',
    'YouTube thumbnail sablon': 'YouTube thumbnail template',
    'Facebook borítókép': 'Facebook cover template',
    'AI kép generátor': 'AI image generator',
    'AI videó szerkesztő': 'AI video editor',
    'AI hang klónozó': 'AI voice cloning tool',
    'AI zene generátor': 'AI music generator',
    'AI arc animátor': 'AI face animator',
    'AI felirat író': 'AI caption writer',
    'AI háttér eltávolító': 'AI background remover',
    'AI közösségi média tervező': 'AI social media designer'
  };
  
  return translations[hungarianDesc] || hungarianDesc;
};

class DataService {
  private database: any = null;

  async loadDatabase() {
    if (!this.database) {
      const response = await fetch('/database.json');
      this.database = await response.json();
    }
    return this.database;
  }

  async getAllItems(): Promise<DatabaseItem[]> {
    const db = await this.loadDatabase();
    const items: DatabaseItem[] = [];
    let id = 1;

    // Process creative assets
    for (const [subcategory, subcategoryItems] of Object.entries(db.categories.creative_assets)) {
      for (const item of subcategoryItems as any[]) {
        items.push({
          id: `ca_${id++}`,
          ...item,
          description: translateDescription(item.description),
          category_main: 'creative_assets',
          subcategory
        });
      }
    }

    // Process AI tools
    for (const [subcategory, subcategoryItems] of Object.entries(db.categories.ai_tools)) {
      for (const item of subcategoryItems as any[]) {
        items.push({
          id: `ai_${id++}`,
          ...item,
          description: translateDescription(item.description),
          category_main: 'ai_tools',
          subcategory
        });
      }
    }

    return items;
  }

  async getCategories(): Promise<DatabaseCategory[]> {
    const db = await this.loadDatabase();
    const categories: DatabaseCategory[] = [];
    
    // Process creative assets categories
    for (const [subcategory, subcategoryItems] of Object.entries(db.categories.creative_assets)) {
      if ((subcategoryItems as any[]).length > 0) {
        categories.push({
          id: `creative_${subcategory}`,
          name: categoryTranslations[subcategory] || subcategory,
          description: categoryDescriptions[subcategory] || '',
          image: categoryImages[subcategory] || '/images/categories/default.jpg',
          items: (subcategoryItems as any[]).map((item, index) => ({
            id: `ca_${subcategory}_${index}`,
            ...item,
            description: translateDescription(item.description),
            category_main: 'creative_assets' as const,
            subcategory
          }))
        });
      }
    }

    // Process AI tools categories
    for (const [subcategory, subcategoryItems] of Object.entries(db.categories.ai_tools)) {
      if ((subcategoryItems as any[]).length > 0) {
        categories.push({
          id: `ai_${subcategory}`,
          name: categoryTranslations[subcategory] || subcategory,
          description: categoryDescriptions[subcategory] || '',
          image: categoryImages[subcategory] || '/images/categories/ai-tools.png',
          items: (subcategoryItems as any[]).map((item, index) => ({
            id: `ai_${subcategory}_${index}`,
            ...item,
            description: translateDescription(item.description),
            category_main: 'ai_tools' as const,
            subcategory
          }))
        });
      }
    }

    return categories;
  }

  async getCategoryBySlug(slug: string): Promise<DatabaseCategory | null> {
    const categories = await this.getCategories();
    return categories.find(cat => this.createSlug(cat.name) === slug) || null;
  }

  createSlug(text: string): string {
    return text.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async searchItems(query: string, filters?: {
    category?: string;
    type?: string;
    license?: string;
    platform?: string;
    tags?: string[];
  }): Promise<DatabaseItem[]> {
    const items = await this.getAllItems();
    
    return items.filter(item => {
      // Text search
      const searchableText = `${item.name} ${item.description} ${item.tags.join(' ')} ${item.platform}`.toLowerCase();
      const matchesQuery = !query || searchableText.includes(query.toLowerCase());
      
      // Filters
      const matchesCategory = !filters?.category || item.subcategory === filters.category;
      const matchesType = !filters?.type || item.type === filters.type;
      const matchesLicense = !filters?.license || item.license_type === filters.license;
      const matchesPlatform = !filters?.platform || item.platform === filters.platform;
      const matchesTags = !filters?.tags || filters.tags.every(tag => 
        item.tags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
      );
      
      return matchesQuery && matchesCategory && matchesType && matchesLicense && matchesPlatform && matchesTags;
    });
  }

  async getPopularItems(limit: number = 12): Promise<DatabaseItem[]> {
    const items = await this.getAllItems();
    return items
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, limit);
  }

  async getFilterOptions() {
    const items = await this.getAllItems();
    
    return {
      categories: [...new Set(items.map(item => item.subcategory))],
      types: [...new Set(items.map(item => item.type))],
      licenses: [...new Set(items.map(item => item.license_type))],
      platforms: [...new Set(items.map(item => item.platform))],
      tags: [...new Set(items.flatMap(item => item.tags))]
    };
  }
}

export const dataService = new DataService();
