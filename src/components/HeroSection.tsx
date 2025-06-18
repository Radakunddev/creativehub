import React from 'react';
import { ArrowRight, Star, Download, Users, Database } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const stats = [
    { icon: Database, label: 'Creative Assets', value: '60+' },
    { icon: Star, label: 'Premium Quality', value: '100%' },
    { icon: Download, label: 'Free Downloads', value: 'Unlimited' },
    { icon: Users, label: 'Creators Served', value: '10K+' }
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/backgrounds/hero-banner.png" 
          alt="Creative workspace"
          className="w-full h-full object-cover opacity-10 dark:opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 dark:bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-pink-400/10 dark:bg-pink-500/5 rounded-full filter blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8 border border-blue-200 dark:border-blue-700">
            <Star className="w-4 h-4 mr-2" />
            Free Premium Creative Resources
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Unleash Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Creative </span>
            Potential
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of free creative assets and cutting-edge AI tools. From video templates to AI-powered design tools – everything you need to create stunning content.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
            {[
              'Video Templates',
              'LUTs & Transitions',
              'Fonts & Typography',
              'AI Tools',
              'Sound Effects',
              '3D Models',
              'Icons & Graphics'
            ].map((feature, index) => (
              <span 
                key={feature}
                className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onExploreClick}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Explore Resources
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse Categories
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
