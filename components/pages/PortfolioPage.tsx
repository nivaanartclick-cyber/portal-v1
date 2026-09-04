'use client';

import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useAppRouter } from '@/lib/navigation';

const samples = [
  {
    id: 'before-after-1',
    title: 'Before & After Sample',
    description: 'A single before-and-after example showing the refinement of artwork into a production-ready output.',
    items: [{ id: 'before-after-1-item', label: 'Before & After', src: '/portfolio/image1.png' }],
  },
  {
    id: 'before-after-2',
    title: 'Before & After Sample',
    description: 'A second single before-and-after example showing the same workflow on another artwork set.',
    items: [{ id: 'before-after-2-item', label: 'Before & After', src: '/portfolio/image2.png' }],
  },
  {
    id: 'line-art',
    title: 'Line Art Example',
    description: 'Image3 showcases a line art treatment suitable for clean print reproduction and tracing references.',
    items: [{ id: 'line-art-item', label: 'Line Art', src: '/portfolio/image3.png' }],
  },
  {
    id: 'conversion',
    title: 'Raster to Vector Conversion and Vector to Embroidery Digitizing Conversion',
    description: 'A single example of raster-to-vector conversion and vector-to-embroidery digitizing conversion workflows.',
    items: [{ id: 'conversion-item', label: 'Raster to Vector Conversion and Vector to Embroidery Digitizing Conversion', src: '/portfolio/image4.png' }],
  },
];

export default function PortfolioPage() {
  const { goTo } = useAppRouter();
  const [selectedImage, setSelectedImage] = useState<{ src: string; label: string } | null>(null);

  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-gray-950 py-24 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
            PORTFOLIO
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-gray-900 dark:text-white">
            Before, After, and Production-Ready Samples
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Review a few examples of how ArtClick prepares artwork for vector conversion, line art cleanup, and embroidery-ready delivery.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900/40 dark:via-gray-950 dark:to-gray-900/50 py-24">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-4 right-10 h-52 w-52 rounded-full bg-brand-accent/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {samples.map((section, sectionIndex) => (
            <div key={section.id} className="space-y-6">
              <div className="max-w-3xl space-y-3">
                <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.description}
                </p>
              </div>

              <div className={`grid gap-8 ${section.items.length === 1 ? 'grid-cols-1 max-w-3xl' : 'grid-cols-1 md:grid-cols-2'}`}>
                {section.items.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Open ${item.label}`}
                    onClick={() => setSelectedImage({ src: item.src, label: item.label })}
                    className="portfolio-card-enter group text-left rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/10 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    style={{ animationDelay: `${sectionIndex * 110 + itemIndex * 90}ms` }}
                  >
                    <div className="aspect-[16/10] sm:aspect-[5/3] bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 p-3 sm:p-4">
                      <img
                        src={item.src}
                        alt={item.label}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-brand-blue font-bold">
                        {item.label}
                      </p>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        Click to expand
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="portfolio-modal-enter relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image preview"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[82vh] overflow-hidden bg-gradient-to-b from-gray-100 to-white p-3 sm:p-5">
              <img src={selectedImage.src} alt={selectedImage.label} className="max-h-[76vh] w-full h-full object-contain" />
            </div>

            <div className="border-t border-gray-200 bg-white px-5 py-4">
              <p className="text-sm font-medium text-gray-800">{selectedImage.label}</p>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white dark:bg-gray-950 py-20 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
            Need a similar result for your artwork?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Send your files and requirements to ArtClick and we will recommend the right conversion or digitizing workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={() => goTo('submit-project')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-black text-white hover:bg-brand-blue text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              Submit Project
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo('contact')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium transition-colors cursor-pointer"
            >
              Contact ArtClick
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
