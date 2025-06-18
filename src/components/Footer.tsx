import React from 'react';
import { Database, Heart, Github, Twitter, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Video Templates', href: '#video-templates' },
    { name: 'LUTs & Transitions', href: '#luts-transitions' },
    { name: 'Fonts', href: '#fonts' },
    { name: 'AI Tools', href: '#ai-tools' },
  ];

  const resources = [
    { name: 'Free Premiere Pro Templates', href: '#premiere-templates' },
    { name: 'After Effects Templates', href: '#after-effects' },
    { name: 'DaVinci Resolve LUTs', href: '#davinci-luts' },
    { name: 'AI Image Generators', href: '#ai-image' },
  ];

  const legal = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'License Information', href: '#licenses' },
    { name: 'DMCA Policy', href: '#dmca' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CreativeHub</h3>
                <p className="text-sm text-gray-400">Free Creative Resources</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your ultimate destination for free creative assets and cutting-edge AI tools. 
              Empowering creators worldwide with premium quality resources.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white flex items-center group transition-colors duration-200"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Featured Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a 
                    href={resource.href}
                    className="text-gray-300 hover:text-white flex items-center group transition-colors duration-200"
                  >
                    <span>{resource.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-300 hover:text-white flex items-center group transition-colors duration-200"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">Stay Updated</h5>
              <p className="text-xs text-gray-400 mb-3">Get notified about new assets</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} CreativeHub. All rights reserved.
              </p>
              <div className="hidden md:flex items-center text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 mx-1" />
                <span>for creators worldwide</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>60+ Free Assets</span>
              <span>•</span>
              <span>15+ Categories</span>
              <span>•</span>
              <span>100% Free</span>
            </div>
          </div>
        </div>

        {/* SEO Keywords Footer */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-500 leading-relaxed">
            Free creative assets including Premiere Pro templates, After Effects templates, DaVinci Resolve LUTs, 
            transitions, overlays, fonts, sound effects, 3D models, icons, social media templates, and AI tools for 
            content creators, videographers, graphic designers, YouTubers, TikTok creators, and social media managers. 
            Download premium quality creative resources for commercial use completely free.
          </p>
        </div>
      </div>
    </footer>
  );
};
