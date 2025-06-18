import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';
import { DatabaseItem, dataService } from '../services/dataService';
import { AssetCard } from './AssetCard';

interface FeaturedSectionProps {
  onViewAllClick: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onViewAllClick }) => {
  const [popularItems, setPopularItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularItems = async () => {
      try {
        const items = await dataService.getPopularItems(8);
        setPopularItems(items);
      } catch (error) {
        console.error('Failed to load popular items:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPopularItems();
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Most Popular This Week
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Creative Assets
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the most popular and trending creative resources loved by our community
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {popularItems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Popularity Rank Badge */}
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    'bg-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                </div>
              )}
              
              <AssetCard item={item} className="h-full" />
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every asset is carefully curated and tested for professional use
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Always Updated</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Fresh content added weekly to keep you ahead of trends
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Instant Access</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Download immediately with direct links to original sources
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={onViewAllClick}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Creative Assets
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
