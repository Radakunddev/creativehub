import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import { dataService } from '../services/dataService';

interface FilterOptions {
  categories: string[];
  types: string[];
  licenses: string[];
  platforms: string[];
  tags: string[];
}

interface Filters {
  category?: string;
  type?: string;
  license?: string;
  platform?: string;
  tags?: string[];
}

interface FilterControlsProps {
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sortBy: 'popularity' | 'name' | 'recent', order: 'asc' | 'desc') => void;
  currentFilters: Filters;
  currentSort: { by: 'popularity' | 'name' | 'recent'; order: 'asc' | 'desc' };
  totalResults: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  onFiltersChange,
  onSortChange,
  currentFilters,
  currentSort,
  totalResults
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    types: [],
    licenses: [],
    platforms: [],
    tags: []
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags || []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await dataService.getFilterOptions();
      setFilterOptions(options);
    };
    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string | undefined) => {
    const newFilters = {
      ...currentFilters,
      [key]: value === 'all' ? undefined : value
    };
    onFiltersChange(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    const newFilters = {
      ...currentFilters,
      tags: newTags.length > 0 ? newTags : undefined
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(currentFilters).some(filter => 
    filter !== undefined && (Array.isArray(filter) ? filter.length > 0 : true)
  );

  const categoryTranslations: Record<string, string> = {
    'video_templates': 'Video Templates',
    'luts_transitions_overlays': 'LUTs & Transitions',
    'canva_psd_figma_templates': 'Design Templates',
    'fonts': 'Fonts',
    'sound_fx_music': 'Audio & Music',
    '3d_models': '3D Models',
    'icons_svg': 'Icons & SVG',
    'social_media_templates': 'Social Media',
    'ai_image_generators': 'AI Image Tools',
    'ai_video_tools': 'AI Video Tools',
    'ai_voice_cloning_tts': 'AI Voice Tools',
    'ai_music_generators': 'AI Music Tools',
    'ai_caption_script_writers': 'AI Writing Tools',
    'ai_background_remover': 'AI Background Tools',
    'ai_social_media_designers': 'AI Social Tools'
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-700/30 dark:hover:bg-red-700/50 rounded-md border border-red-200 dark:border-red-500/50 transition-colors duration-150"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalResults} results found
            </span>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={currentSort.by}
              onChange={(e) => onSortChange(e.target.value as any, currentSort.order)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="popularity">Popularity</option>
              <option value="name">Name</option>
              <option value="recent">Recent</option>
            </select>
            <button
              onClick={() => onSortChange(currentSort.by, currentSort.order === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title={`Sort ${currentSort.order === 'asc' ? 'descending' : 'ascending'}`}
            >
              {currentSort.order === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isOpen && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Category
                </label>
                <select
                  value={currentFilters.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>
                      {categoryTranslations[category] || category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Type
                </label>
                <select
                  value={currentFilters.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* License Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  License
                </label>
                <select
                  value={currentFilters.license || 'all'}
                  onChange={(e) => handleFilterChange('license', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Licenses</option>
                  {filterOptions.licenses.map(license => (
                    <option key={license} value={license}>
                      {license.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Platform
                </label>
                <select
                  value={currentFilters.platform || 'all'}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Platforms</option>
                  {filterOptions.platforms.map(platform => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filterOptions.tags.slice(0, 30).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
