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
  const [filters, setFilters] = useState<Filters>({}); // Initialized empty, will be populated from URL or initialFilters
  const [sort, setSort] = useState<{ by: 'popularity' | 'name' | 'recent'; order: 'asc' | 'desc' }>({
    by: 'popularity',
    order: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Effect to initialize state from URL and load items
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearch = urlParams.get('search');
    const urlCategory = urlParams.get('category');
    const urlType = urlParams.get('type');
    const urlLicense = urlParams.get('license');
    const urlPlatform = urlParams.get('platform');
    const urlTags = urlParams.get('tags');
    const urlSortBy = urlParams.get('sortBy') as 'popularity' | 'name' | 'recent' | null;
    const urlSortOrder = urlParams.get('sortOrder') as 'asc' | 'desc' | null;
    const urlPage = urlParams.get('page');

    setFilters({
      category: urlCategory || initialFilters.category || undefined,
      type: urlType || initialFilters.type || undefined,
      license: urlLicense || initialFilters.license || undefined,
      platform: urlPlatform || initialFilters.platform || undefined,
      tags: urlTags ? urlTags.split(',') : initialFilters.tags || [],
    });

    if (urlSortBy) {
      setSort({ by: urlSortBy, order: urlSortOrder || 'desc' });
    } else {
      setSort({ by: 'popularity', order: 'desc' });
    }

    setCurrentPage(urlPage ? parseInt(urlPage, 10) : 1);

    // If URL has a search query, it overrides the prop for initial state setting
    // The App component will handle updating the searchQuery prop if the URL changes
    // For now, we let searchQuery prop dictate search if no 'search' in URL.
    // The second useEffect will sync URL with searchQuery prop if it changes.

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
  }, [initialFilters]); // Rerun if initialFilters change, e.g. category navigation

  // Effect to update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery); // searchQuery prop from App
    if (filters.category) params.set('category', filters.category);
    if (filters.type) params.set('type', filters.type);
    if (filters.license) params.set('license', filters.license);
    if (filters.platform) params.set('platform', filters.platform);
    if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));

    if (sort.by !== 'popularity' || sort.order !== 'desc') {
      params.set('sortBy', sort.by);
      params.set('sortOrder', sort.order);
    }

    if (currentPage > 1) params.set('page', currentPage.toString());

    const newQueryString = params.toString();
    const newUrl = newQueryString
      ? `${window.location.pathname}?${newQueryString}`
      : window.location.pathname;

    window.history.pushState({ path: newUrl }, '', newUrl);
  }, [searchQuery, filters, sort, currentPage]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = allItems;

    // Apply search (searchQuery prop is the source of truth for search term)
    const currentSearchQuery = searchQuery; // Use the prop directly
    if (currentSearchQuery) {
      result = result.filter(item => {
        const searchableText = `${item.name} ${item.description} ${item.tags.join(' ')} ${item.platform}`.toLowerCase();
        return searchableText.includes(currentSearchQuery.toLowerCase());
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
        filters.tags!.every(tag => {
          const lowerTag = tag.toLowerCase();
          return item.tags.some(itemTag => itemTag.toLowerCase().includes(lowerTag));
        })
      );
    }

    // Apply sorting
    // Ensure a stable sort if scores are equal, e.g., by name
    result = [...result].sort((a, b) => {
      let comparison = 0;
      
      switch (sort.by) {
        case 'popularity':
          comparison = b.popularity_score - a.popularity_score;
          if (comparison === 0) comparison = a.name.localeCompare(b.name); // Secondary sort
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'recent':
          // For now, we'll use popularity_score as a proxy for recency (higher is newer)
          comparison = b.popularity_score - a.popularity_score;
          if (comparison === 0) comparison = a.name.localeCompare(b.name); // Secondary sort
          break;
      }
      
      return sort.order === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [allItems, searchQuery, filters, sort]); // searchQuery is a prop, filters and sort are state

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFiltersChange = (newFilters: Filters) => {
    // When filters change, update the state. The useEffect for URL update will handle the rest.
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: 'popularity' | 'name' | 'recent', newOrder: 'asc' | 'desc') => {
    setSort({ by: newSortBy, order: newOrder });
    setCurrentPage(1);
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
                // Clearing filters means setting them to empty/default values
                // The searchQuery prop is managed by App.tsx, so we don't clear it here directly.
                // If there's a desire to clear search via this button, App.tsx would need a callback.
                setFilters({ tags: [] }); // Clear all filters, keeping tags as an empty array
                setSort({ by: 'popularity', order: 'desc' }); // Reset sort
                setCurrentPage(1);
                // The useEffect for URL update will sync this.
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
                
                {/* Basic pagination: show current page and immediate next/prev for simplicity */}
                {/* A more advanced pagination could show more page numbers */}
                {currentPage > 2 && (
                  <button onClick={() => setCurrentPage(1)} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">1</button>
                )}
                {currentPage > 3 && <span className="px-2 py-2">...</span>}

                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">{currentPage - 1}</button>
                )}

                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">{currentPage}</button>

                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">{currentPage + 1}</button>
                )}

                {currentPage < totalPages - 2 && <span className="px-2 py-2">...</span>}
                {currentPage < totalPages -1 && (
                   <button onClick={() => setCurrentPage(totalPages)} className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">{totalPages}</button>
                )}
                
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
