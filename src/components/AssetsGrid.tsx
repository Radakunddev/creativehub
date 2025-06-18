import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseItem, dataService } from '../services/dataService';
import { AssetCard } from './AssetCard';
import { FilterControls } from './FilterControls';
import { Loader2, Grid3X3, Grid2X2, LayoutGrid, Search } from 'lucide-react';

interface Filters {
  category?: string;
  type?: string;
  license?: string;
  platform?: string;
  tags?: string[];
}

interface AssetsGridProps {
  searchQuery: string;
  sectionId?: string;
  title?: string;
  subtitle?: string;
  initialFilters?: Filters;
}

export const AssetsGrid: React.FC<AssetsGridProps> = ({ 
  searchQuery, 
  sectionId,
  title = "Creative Resources",
  subtitle = "Discover amazing free creative assets and AI tools",
  initialFilters = {}
}) => {
  const [allItems, setAllItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sort, setSort] = useState<{ by: 'popularity' | 'name' | 'recent'; order: 'asc' | 'desc' }>({
    by: 'popularity',
    order: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const items = await dataService.getAllItems();
        setAllItems(items);
      } catch (error) {
        console.error('Failed to load items:', error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = allItems;

    // Apply search
    if (searchQuery) {
      result = result.filter(item => {
        const searchableText = `${item.name} ${item.description} ${item.tags.join(' ')} ${item.platform}`.toLowerCase();
        return searchableText.includes(searchQuery.toLowerCase());
      });
    }

    // Apply filters
    if (filters.category) {
      result = result.filter(item => item.subcategory === filters.category);
    }
    if (filters.type) {
      result = result.filter(item => item.type === filters.type);
    }
    if (filters.license) {
      result = result.filter(item => item.license_type === filters.license);
    }
    if (filters.platform) {
      result = result.filter(item => item.platform === filters.platform);
    }
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(item => 
        filters.tags!.every(tag => 
          item.tags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let comparison = 0;
      
      switch (sort.by) {
        case 'popularity':
          comparison = b.popularity_score - a.popularity_score;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'recent':
          // For now, we'll use popularity as a proxy for recency
          comparison = b.popularity_score - a.popularity_score;
          break;
      }
      
      return sort.order === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [allItems, searchQuery, filters, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (sortBy: 'popularity' | 'name' | 'recent', order: 'asc' | 'desc') => {
    setSort({ by: sortBy, order });
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const getGridClass = () => {
    switch (viewMode) {
      case 'compact':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
      case 'list':
        return 'grid-cols-1 gap-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading creative assets...</p>
        </div>
      </div>
    );
  }

  return (
    <section id={sectionId} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          {searchQuery && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg">
              <Search className="w-4 h-4 mr-2" />
              <span>Search results for: "{searchQuery}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <FilterControls
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        currentFilters={filters}
        currentSort={sort}
        totalResults={filteredAndSortedItems.length}
      />

      {/* View Mode Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'compact' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Compact view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="List view"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border-0 focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
              <option value={96}>96 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No assets found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setFilters({});
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid ${getGridClass()}`}>
              {paginatedItems.map((item) => (
                <AssetCard 
                  key={item.id} 
                  item={item}
                  className={viewMode === 'list' ? 'md:flex md:items-center' : ''}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
