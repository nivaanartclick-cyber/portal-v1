'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pageIdFromPath, useAppRouter, type PageId } from '@/lib/navigation';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const pathname = usePathname();
  const currentPage = pageIdFromPath(pathname);
  const { goTo } = useAppRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; id: PageId; highlight?: boolean; secondary?: boolean }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
    { label: 'Careers', id: 'careers' },
    { label: 'Request Revision', id: 'request-revision', secondary: true },
    { label: 'Get a Quote', id: 'submit-project', highlight: true },
  ];

  const handleNavClick = (id: PageId) => {
    goTo(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-brand-primary/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <BrandLogo height={44} onClick={() => handleNavClick('home')} />

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                if (item.highlight) {
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className="ml-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {item.label}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  );
                }
                if (item.secondary) {
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`ml-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        isActive
                          ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                          : 'border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer relative ${
                      isActive
                        ? 'text-ink dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-brand-primary/5'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex lg:hidden items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-brand-primary/5 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 bg-surface dark:bg-gray-950 border-b border-brand-primary/10 z-40 lg:hidden shadow-lg"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                if (item.highlight) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium text-sm flex items-center justify-center gap-2"
                    >
                      {item.label}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-brand-primary/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
