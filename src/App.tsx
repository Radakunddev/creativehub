import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedSection } from './components/FeaturedSection';
import { AssetsGrid } from './components/AssetsGrid';
import { Footer } from './components/Footer';

type ViewMode = 'home' | 'assets' | 'category';

interface Filters {
  category?: string;
  type?: string;
  license?: string;
  platform?: string;
  tags?: string[];
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setViewMode('assets');
    } else if (viewMode === 'assets' && !selectedCategory) {
      setViewMode('home');
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setViewMode('category');
    setSearchQuery('');
    
    // Extract category name from ID for filtering
    const categoryName = categoryId.replace('creative_', '').replace('ai_', '');
    setFilters({ category: categoryName });
  };

  // Handle view all assets
  const handleViewAllAssets = () => {
    setViewMode('assets');
    setSelectedCategory('');
    setSearchQuery('');
    setFilters({});
  };

  // Handle explore from hero
  const handleExploreClick = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle back to home
  const handleBackToHome = () => {
    setViewMode('home');
    setSelectedCategory('');
    setSearchQuery('');
    setFilters({});
  };

  // SEO and meta tags
  useEffect(() => {
    let title = 'CreativeHub - Free Creative Assets & AI Tools Database';
    let description = 'Discover 60+ free creative assets including video templates, LUTs, fonts, AI tools and more for content creators, videographers and designers.';

    if (viewMode === 'assets' && searchQuery) {
      title = `Search Results for "${searchQuery}" - CreativeHub`;
      description = `Find free creative assets and AI tools related to "${searchQuery}". Premium quality resources for content creators.`;
    } else if (viewMode === 'category' && selectedCategory) {
      title = `${selectedCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - CreativeHub`;
      description = `Browse free ${selectedCategory.replace(/_/g, ' ')} for content creators and designers. High-quality resources ready for commercial use.`;
    }

    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [viewMode, searchQuery, selectedCategory]);

  // Scroll to top when view mode or main identifiers change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode, searchQuery, selectedCategory]);

  const handleNavigateToHomeSection = (sectionHref: string) => {
    handleBackToHome(); // Resets viewMode to 'home' and clears other states

    // Use requestAnimationFrame to wait for DOM update after state change
    requestAnimationFrame(() => {
      // A second rAF can be more robust for waiting for layout and paint
      requestAnimationFrame(() => {
        const sectionId = sectionHref.substring(1); // Remove '#'
        if (sectionId === 'home' || sectionId === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.warn(`[App.tsx] Element with ID '${sectionId}' not found for scrolling.`);
            // Fallback to top if specific section not found after view change
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onNavigate={handleNavigateToHomeSection} // New prop
        />

        {/* Main Content */}
        <main>
          {viewMode === 'home' ? (
            <>
              {/* Hero Section */}
              <HeroSection onExploreClick={handleExploreClick} />
              
              {/* Categories Section - Moved above Featured */}
              <div id="categories">
                <CategoriesSection onCategorySelect={handleCategorySelect} />
              </div>
              
              {/* Featured Section - Now below Categories */}
              <div id="featured">
                <FeaturedSection onViewAllClick={handleViewAllAssets} />
              </div>
              
              {/* AI Tools Section */}
              <section id="ai-tools" className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    AI-Powered Tools
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                    Discover cutting-edge AI tools for image generation, video editing, voice synthesis, and more
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ category: 'ai_image_generators' });
                      setViewMode('assets');
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Explore AI Tools
                  </button>
                </div>
              </section>

              {/* Creative Assets Section */}
              <section id="creative-assets" className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Creative Assets
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                    Professional-grade templates, effects, and resources for all your creative projects
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ category: 'video_templates' });
                      setViewMode('assets');
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Browse Assets
                  </button>
                </div>
              </section>

              {/* About Section */}
              <section id="about" className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    About CreativeHub
                  </h2>
                  <div className="prose prose-lg prose-gray dark:prose-invert mx-auto">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      CreativeHub is your ultimate destination for free, high-quality creative assets and AI tools. 
                      We curate the best resources from across the web to help content creators, videographers, 
                      graphic designers, and social media managers bring their visions to life.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Our database includes over 60 carefully selected resources including Premiere Pro templates, 
                      After Effects projects, DaVinci Resolve LUTs, transitions, overlays, fonts, sound effects, 
                      3D models, icons, and cutting-edge AI tools - all available for commercial use completely free.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Whether you're creating content for YouTube, TikTok, Instagram, or any other platform, 
                      CreativeHub provides the professional-grade resources you need to stand out and engage your audience.
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* Assets Grid View */
            <AssetsGrid
              searchQuery={searchQuery}
              sectionId={viewMode === 'category' ? 'category-assets' : 'search-results'}
              title={
                viewMode === 'category' 
                  ? selectedCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  : searchQuery 
                    ? `Search Results` 
                    : 'All Creative Assets'
              }
              subtitle={
                viewMode === 'category'
                  ? `Browse our collection of ${selectedCategory.replace(/_/g, ' ').toLowerCase()}`
                  : searchQuery
                    ? `Found resources matching "${searchQuery}"`
                    : 'Explore our complete collection of free creative resources and AI tools'
              }
              initialFilters={filters}
            />
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;