import React, { useState, useEffect } from 'react';
import { ArrowRight, Palette, Cpu, Film, Music, Type, Box, Image, Megaphone } from 'lucide-react';
import { DatabaseCategory, dataService } from '../services/dataService';

interface CategoriesSectionProps {
  onCategorySelect: (category: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<DatabaseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await dataService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('video')) return Film;
    if (name.includes('audio') || name.includes('music')) return Music;
    if (name.includes('font')) return Type;
    if (name.includes('3d')) return Box;
    if (name.includes('icon') || name.includes('svg')) return Image;
    if (name.includes('social')) return Megaphone;
    if (name.includes('ai')) return Cpu;
    return Palette;
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-blue-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500',
      'from-orange-500 to-red-500',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="categories" className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse our carefully curated collection of creative assets and AI tools organized by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.name);
            const gradientClass = getGradientClass(index);
            
            return (
              <div
                key={category.id}
                className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
                onClick={() => onCategorySelect(category.id)}
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className={`${category.image ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br ${gradientClass} items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-white" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Item Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {category.items.length} items
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 bg-gradient-to-br ${gradientClass} rounded-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>

                  {/* Popular Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {category.items.slice(0, 3).map((item, itemIndex) => (
                      <span 
                        key={itemIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                      >
                        {item.tags[0]}
                      </span>
                    ))}
                    {category.items.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
                        +{category.items.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Explore collection
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Palette className="w-5 h-5 mr-2" />
            View All {categories.reduce((acc, cat) => acc + cat.items.length, 0)} Assets
          </div>
        </div>
      </div>
    </section>
  );
};
