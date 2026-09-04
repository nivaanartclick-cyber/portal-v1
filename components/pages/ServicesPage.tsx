'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  ArrowRight, Scissors, Layers, Eye, RefreshCw, 
  Sparkles, Sun, User, Cpu, CircleDot, HelpCircle 
} from 'lucide-react';
import { SERVICES } from '@/data/mockData';
import { useAppRouter } from '@/lib/navigation';

export default function ServicesPage() {
  const pathname = usePathname();
  const { goTo, goToSubmitWithService } = useAppRouter();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [pathname]);

  const handleOrderClick = (serviceTitle: string) => {
    goToSubmitWithService(serviceTitle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'vector-conversion':
        return <CircleDot className="w-8 h-8 text-brand-blue" />;
      case 'clipping-path':
        return <Scissors className="w-8 h-8 text-brand-blue" />;
      case 'background-removal':
        return <Layers className="w-8 h-8 text-brand-blue" />;
      case 'image-masking':
        return <Eye className="w-8 h-8 text-brand-blue" />;
      case 'photo-retouching':
        return <Sparkles className="w-8 h-8 text-brand-blue" />;
      case 'shadow-creation':
        return <Sun className="w-8 h-8 text-brand-blue" />;
      case 'ghost-mannequin':
        return <User className="w-8 h-8 text-brand-blue" />;
      case 'color-change':
        return <RefreshCw className="w-8 h-8 text-brand-blue" />;
      case 'image-manipulation':
        return <Layers className="w-8 h-8 text-brand-blue" />;
      case 'digitizing-services':
        return <Cpu className="w-8 h-8 text-brand-blue" />;
      default:
        return <HelpCircle className="w-8 h-8 text-brand-blue" />;
    }
  };

  // Helper to render high-end SVG vector layout schema depending on service
  const renderServiceVisual = (id: string) => {
    switch (id) {
      case 'vector-conversion':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-blue-50/30 dark:bg-blue-950/10">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-brand-blue opacity-80" stroke="currentColor" strokeWidth="1" fill="none">
              <rect x="10" y="10" width="80" height="80" rx="10" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="30" strokeWidth="2" />
              <path d="M50,10 L50,90" strokeDasharray="2 2" />
              <path d="M10,50 L90,50" strokeDasharray="2 2" />
              <circle cx="50" cy="20" r="2.5" fill="currentColor" />
              <circle cx="50" cy="80" r="2.5" fill="currentColor" />
              <circle cx="20" cy="50" r="2.5" fill="currentColor" />
              <circle cx="80" cy="50" r="2.5" fill="currentColor" />
              <line x1="50" y1="20" x2="75" y2="20" stroke="#9ca3af" />
              <line x1="50" y1="80" x2="25" y2="80" stroke="#9ca3af" />
              <circle cx="75" cy="20" r="1.5" fill="#ffffff" stroke="currentColor" />
              <circle cx="25" cy="80" r="1.5" fill="#ffffff" stroke="currentColor" />
            </svg>
          </div>
        );
      case 'clipping-path':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-red-50/20 dark:bg-red-950/5">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-red-500 opacity-85" stroke="currentColor" strokeWidth="1.5" fill="none">
              {/* Product shoe silhouette cutout */}
              <path d="M15,70 Q30,40 50,50 T85,45 Q80,75 55,75 Z" strokeDasharray="1 1" />
              <path d="M15,70 Q30,40 50,50 T85,45 Q80,75 55,75 Z" strokeWidth="2.5" />
              {/* Node points with vector handlers */}
              <circle cx="15" cy="70" r="2" fill="currentColor" />
              <circle cx="35" cy="45" r="2" fill="currentColor" />
              <circle cx="50" cy="50" r="2" fill="currentColor" />
              <circle cx="68" cy="48" r="2" fill="currentColor" />
              <circle cx="85" cy="45" r="2" fill="currentColor" />
              <circle cx="55" cy="75" r="2" fill="currentColor" />
              {/* Pen cursor */}
              <path d="M35,45 L25,30 M35,45 L45,60" stroke="#6b7280" strokeWidth="0.5" />
              <circle cx="25" cy="30" r="1" fill="#fff" stroke="currentColor" />
              <circle cx="45" cy="60" r="1" fill="#fff" stroke="currentColor" />
            </svg>
          </div>
        );
      case 'background-removal':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-emerald-50/20 dark:bg-emerald-950/5">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:10px_10px]" />
              {/* Foreground solid card */}
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center relative z-10 transition-transform hover:scale-110">
                <Layers className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
          </div>
        );
      case 'image-masking':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-purple-50/30 dark:bg-purple-950/10">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-purple-600 opacity-80" stroke="currentColor" strokeWidth="1" fill="none">
              <circle cx="50" cy="50" r="35" strokeDasharray="4 4" />
              {/* Fine hair lines */}
              <path d="M50,15 C45,30 35,45 20,50" />
              <path d="M50,15 C55,30 65,45 80,50" />
              <path d="M50,15 C50,40 50,70 50,85" />
              <path d="M50,15 C42,28 30,35 15,35" />
              <path d="M50,15 C58,28 70,35 85,35" />
              <circle cx="50" cy="15" r="3" fill="currentColor" />
            </svg>
          </div>
        );
      case 'photo-retouching':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-amber-50/20 dark:bg-amber-950/5">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/80 flex items-center justify-center relative">
                <Sparkles className="w-10 h-10 text-amber-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">RAW</div>
              </div>
            </div>
          </div>
        );
      case 'digitizing-services':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-brand-blue/10">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-brand-blue opacity-85" stroke="currentColor" strokeWidth="1.2" fill="none">
              {/* Stitch mesh layout */}
              <path d="M20,20 L80,20 L50,80 Z" strokeDasharray="1 2" />
              <path d="M20,20 L30,40 L40,20 L50,40 L60,20 L70,40 L80,20" strokeWidth="2" strokeLinecap="round" />
              <path d="M30,40 L40,60 L50,40 L60,60 L70,40" strokeWidth="2" strokeLinecap="round" />
              <path d="M40,60 L50,80 L60,60" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="80" r="3" fill="currentColor" />
              <circle cx="20" cy="20" r="3" fill="currentColor" />
              <circle cx="80" cy="20" r="3" fill="currentColor" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
            <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <Layers className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pt-20">
      {/* Services Header */}
      <section className="bg-gray-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
            DETAILED WORKFLOW CATALOG
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none">
            Expert Graphics Production.
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Every file is processed manually by dedicated technical operators who understand print margins, web compression limits, and embroidery machine sew tolerances.
          </p>
        </div>
      </section>

      {/* Services Grid/Sections list */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {SERVICES.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-gray-100 dark:border-gray-900 pb-20 last:border-none last:pb-0 scroll-mt-28`}
                >
                  {/* Service Schematic Media Box */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative aspect-video lg:aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm group">
                      {renderServiceVisual(service.id)}
                      {/* Hover overlay stats details */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-950/95 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-gray-500 uppercase">SPEC: HIGH FIDELITY</span>
                          <span className="font-mono text-green-500 font-semibold uppercase">TURNAROUND: {service.turnaround}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Text Detail Box */}
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                        {getServiceIcon(service.id)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue">
                          SERVICE #{index + 1}
                        </span>
                        <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    {service.tagline ? (
                      <p className="font-mono text-sm text-gray-500 italic">
                        "{service.tagline}"
                      </p>
                    ) : null}

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest font-mono">
                        {service.id === 'digitizing-services' ? 'Our Services' : 'Key Features & Outputs:'}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mt-1.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <button
                        onClick={() => handleOrderClick(service.title)}
                        className="px-6 py-3.5 rounded-lg bg-black hover:bg-brand-blue text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 group shadow-sm hover:shadow"
                      >
                        {service.id === 'digitizing-services' ? 'Send to Artclick Today' : `Order ${service.title}`}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-800 text-xs font-mono text-gray-500">
                        <span>Guaranteed turn:</span>
                        <strong className="text-gray-900 dark:text-white font-semibold">{service.turnaround}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800/80 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
            Bulk Orders & Vector Conversion
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have multiple artwork files that need vector conversion? Artclick offers professional bulk vector conversion services for logos, images, illustrations, and other artwork.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Simply send us your files and requirements. Our team will convert your artwork into clean, scalable, production-ready vector files with consistent quality across your entire order.
          </p>
          <div className="max-w-3xl mx-auto text-left rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8">
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4">
              Perfect for:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
              {[
                'Bulk logo & artwork conversion',
                'Print and embroidery businesses',
                'Agencies and designers',
                'Large artwork collections',
                'Branding and promotional projects'
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have a bulk project? Send us your files today and get a customized quote from Artclick.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => goTo('contact')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-black text-white hover:bg-brand-blue text-sm font-medium transition-colors cursor-pointer"
            >
              Get a Custom Quote
            </button>
            <button
              onClick={() => goTo('submit-project')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors cursor-pointer"
            >
              Submit Standard Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
