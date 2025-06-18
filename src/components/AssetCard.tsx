import React from 'react';
import { ExternalLink, Download, Star, Tag, Award, Clock } from 'lucide-react';
import { DatabaseItem } from '../services/dataService';

interface AssetCardProps {
  item: DatabaseItem;
  className?: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({ item, className = '' }) => {
  const getPopularityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getPopularityLabel = (score: number) => {
    if (score >= 90) return 'Trending';
    if (score >= 80) return 'Popular';
    if (score >= 70) return 'Good';
    return 'New';
  };

  const getLicenseColor = (license: string) => {
    switch (license.toLowerCase()) {
      case 'free':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'commercial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cc0':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (categoryMain: string) => {
    return categoryMain === 'ai_tools' ? '🤖' : '🎨';
  };

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header with Category Icon and Popularity */}
      <div className="relative p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(item.category_main)}</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {item.type.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${getPopularityColor(item.popularity_score)} fill-current`} />
            <span className={`text-xs font-bold ${getPopularityColor(item.popularity_score)}`}>
              {item.popularity_score}
            </span>
          </div>
        </div>

        {/* Popularity Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.popularity_score >= 90 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              : item.popularity_score >= 80
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {item.popularity_score >= 90 && <Award className="w-3 h-3 mr-1" />}
            {item.popularity_score >= 80 && item.popularity_score < 90 && <Clock className="w-3 h-3 mr-1" />}
            {getPopularityLabel(item.popularity_score)}
          </span>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="relative px-4 mb-4">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden">
          {item.thumbnail_url ? (
            <img 
              src={item.thumbnail_url} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${item.thumbnail_url ? 'hidden' : 'flex'} items-center justify-center h-full text-gray-400 dark:text-gray-500`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{getCategoryIcon(item.category_main)}</div>
              <p className="text-sm font-medium">{item.name}</p>
            </div>
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Platform */}
        {item.platform && (
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Platform:</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
              {item.platform}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>

        {/* License and Action */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLicenseColor(item.license_type)}`}>
            {item.license_type.toUpperCase()}
          </span>
          
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Get Asset</span>
          </a>
        </div>
      </div>
    </div>
  );
};
