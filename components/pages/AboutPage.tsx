'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Target } from 'lucide-react';
import { useAppRouter } from '@/lib/navigation';

export default function AboutPage() {
  const { goTo } = useAppRouter();

  const stats = [
    { value: '24–48h', label: 'Standard Turnaround' },
    { value: 'Global', label: 'Client Reach' },
    { value: '100%', label: 'Hand-Digitized Files' },
    { value: 'Free', label: 'Revisions Included' }
  ];

  const team = [
    {
      name: 'Foram Mishra',
      role: 'Director',
      bio: ''
    },
    {
      name: 'Nivaan',
      role: 'Team Lead - Art Department',
      bio: ''
    },
    {
      name: 'Amit',
      role: 'Finance and Accounting',
      bio: ''
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="bg-white dark:bg-gray-950 py-24 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
            MEET THE AGENCY
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-gray-900 dark:text-white">
            Your Embroidery Digitizing & Design Partner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            ArtClick was founded to solve a problem every promotional products business knows: too much work, too little time, and not enough hands without blowing up the budget. Today we offer embroidery digitizing, vector art, graphic design, staffing, and virtual assistant services — built for this industry.
          </p>
        </div>
      </section>

      {/* Stats Block */}
      <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2 p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="text-4xl sm:text-5xl font-display font-bold text-brand-blue">
                  {stat.value}
                </div>
                <div className="text-xs font-mono tracking-wider uppercase text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story / Mission */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story text */}
            <div className="space-y-6 text-left">
              <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
                How ArtClick Earned Its Reputation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                We began as a small boutique graphics production shop, manually reconstructing pixelated logos for local signs and caps printers. We quickly recognized a global pain point: digital automation tools and low-quality generators frequently introduce math errors, rough edges, and broken lines that ruin final print outputs.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                By focusing strictly on skilled, high-precision manual design operations, we became a trusted secret weapon for major sportswear distributors, e-commerce giants, and sign manufacturers globally. Today, our 24/7 technical team processes thousands of assets daily without sacrificing our signature pixel-perfect layouts.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => goTo('contact')}
                  className="px-6 py-3 rounded-lg bg-black hover:bg-brand-blue text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Contact Our Operations Desk
                </button>
              </div>
            </div>

            {/* Mission Vision Panels */}
            <div className="space-y-8">
              <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 relative">
                <div className="absolute top-6 right-6 text-brand-blue">
                  <Target className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Our Core Mission
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  To eliminate digital pixelation and poor vector math from commercial production, empowering printers and brands to scale physical manufacturing and web layouts with absolute confidence.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 relative">
                <div className="absolute top-6 right-6 text-brand-blue">
                  <Compass className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">
                  Our Global Vision
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  To set the worldwide standard for commercial graphics pre-production pipelines, uniting state-of-the-art vector math with traditional sewing digitizing crafts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Team Placeholders */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              Our Creative Operators
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Meet the production leads managing our manual tracing, skin frequencies, and cap stitching pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((t, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-900 shadow-sm p-8 flex flex-col justify-between min-h-52"
              >
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                    {t.name}
                  </h3>
                  <p className="text-[10px] font-mono uppercase text-brand-blue font-bold tracking-wider">
                    {t.role}
                  </p>
                  {t.bio ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-2">
                      {t.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
