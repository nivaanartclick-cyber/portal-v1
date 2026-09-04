'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Star, Paintbrush 
} from 'lucide-react';
import { SERVICES, TESTIMONIALS, FAQS } from '@/data/mockData';
import { useAppRouter } from '@/lib/navigation';

export default function LandingPage() {
  const { goTo, goToServiceAnchor } = useAppRouter();
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const processSteps = [
    { number: '01', title: 'Submit Artwork', desc: 'Send your logo, image, or sketch along with garment type and required output format (DST, PES, AI, EPS, etc.).' },
    { number: '02', title: 'Hand-Digitize or Trace', desc: 'Our team manually digitizes or traces your design — no auto-digitizing shortcuts — for stitch-perfect, print-ready results.' },
    { number: '03', title: 'Review & Revise', desc: 'Free revisions until your file is production-ready. We revise until you are satisfied.' },
    { number: '04', title: 'Quality Check', desc: 'Every file is reviewed for stitch density, color separations, and format accuracy before delivery.' },
    { number: '05', title: 'Fast Delivery', desc: 'Receive your file in the exact format your embroidery machine or print shop requires — typically within 24–48 hours.' }
  ];

  const landingServiceIds = [
    'vector-conversion',
    'digitizing-services',
    'image-manipulation',
    'staffing-support',
    'virtual-assistants',
    'admin-support'
  ];

  const landingServices = SERVICES.filter((service) => landingServiceIds.includes(service.id));
  const landingServiceTitles: Record<string, string> = {
    'vector-conversion': 'Vector Art Conversion',
    'digitizing-services': 'EMB Digitizing',
    'image-manipulation': 'Graphic Designing',
    'staffing-support': 'Staffing Support',
    'virtual-assistants': 'Virtual Assistants',
    'admin-support': 'Admin Support'
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-32 border-b border-brand-primary/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              className="lg:col-span-7 space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-mono font-medium text-brand-primary">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span>Vector Art Services · EMB Digitizing · Support Staff</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink dark:text-white leading-[1.08]">
                Your Creative & Operations <br />
                <span className="gradient-text">
                  Partner for Promo.
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                ArtClick delivers fast, accurate embroidery digitizing, vector art conversion, and graphic design for screen printers, embroiderers, and promotional product distributors — backed by staffing and virtual assistant support when you need extra hands.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => goTo('submit-project')}
                  className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-medium text-base shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  Submit Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => goTo('services')}
                  className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium text-base transition-colors cursor-pointer"
                >
                  Explore Services
                </button>
              </div>

              {/* Service tags */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 max-w-md mx-auto lg:mx-0 text-left">
                {['Vector Art Conversion', 'EMB Digitizing', 'Graphic Designing', 'Staffing Support', 'Virtual Assistants', 'Admin Support'].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Graphic/Grid Illustration */}
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Interactive Bezier Vector Pen simulation card */}
              <div className="w-full max-w-md mx-auto aspect-square glass-card rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                {/* Visual coordinate markings */}
                <div className="absolute top-4 right-4 font-mono text-[10px] text-gray-400 dark:text-gray-600">
                  X: 284.18, Y: 104.92
                </div>

                <div className="relative flex-1 flex items-center justify-center">
                  {/* Decorative Anchor lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-gray-800" />
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-gray-800" />
                    
                    {/* Simulated Bezier S-curve */}
                    <path d="M40,220 C100,50 200,250 260,80" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Control Handles */}
                    <line x1="100" y1="50" x2="40" y2="220" stroke="#9ca3af" strokeWidth="1" />
                    <line x1="200" y1="250" x2="260" y2="80" stroke="#9ca3af" strokeWidth="1" />
                    
                    {/* Control Handle Anchors */}
                    <circle cx="100" cy="50" r="4.5" fill="#ffffff" stroke="#2563EB" strokeWidth="1.5" />
                    <circle cx="200" cy="250" r="4.5" fill="#ffffff" stroke="#2563EB" strokeWidth="1.5" />

                    {/* Curve Points */}
                    <circle cx="40" cy="220" r="5" fill="#111827" className="dark:fill-white" />
                    <circle cx="260" cy="80" r="5" fill="#111827" className="dark:fill-white" />
                  </svg>

                  {/* Active Anchor point overlay callout */}
                  <div className="absolute top-10 left-12 bg-black dark:bg-white text-white dark:text-black font-mono text-[9px] px-2 py-1 rounded shadow-lg pointer-events-none">
                    Anchor Node #14 [Smooth]
                  </div>

                  <div className="absolute bottom-12 right-12 bg-brand-blue text-white font-mono text-[9px] px-2 py-1 rounded shadow-lg pointer-events-none">
                    Precision: 100% Manual
                  </div>
                </div>

                {/* Card controls row */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">VECTOR PARSE READY</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">EPS</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">SVG</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">DST</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white">
              Professional Production Workflows
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select from our specialized services. Hand-crafted layouts built exactly to standard printing and commercial catalog specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landingServices.map((service) => {
              return (
                <div
                  key={service.id}
                  id={`preview-${service.id}`}
                  className="p-8 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 group flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 text-brand-blue flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white duration-300">
                      <Paintbrush className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                      {landingServiceTitles[service.id] || service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800/80 pt-4 mt-6 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Turnaround: {service.turnaround}</span>
                    <button
                      onClick={() => goToServiceAnchor(service.id)}
                      className="text-brand-blue font-semibold group-hover:translate-x-1 transition-transform cursor-pointer flex items-center gap-1"
                    >
                      Learn More <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => goTo('services')}
              className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              See All Services
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="bg-white dark:bg-gray-950 py-24 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
              HIGH SPEED OPERATION
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white">
              Slick & Direct Pipeline
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submit your project instructions. Watch progress via our active timeline tracking. Complete, verify, deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
            {processSteps.map((step, idx) => {
              return (
                <div key={idx} className="relative group space-y-4 text-center md:text-left">
                  {/* Decorative timeline linking arrow */}
                  {idx < 4 && (
                    <div className="hidden lg:block absolute top-6 left-[75%] right-[-25%] h-0.5 bg-gray-100 dark:bg-gray-800 z-0 group-hover:bg-brand-blue transition-colors duration-300" />
                  )}

                  <div className="relative z-10 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center mx-auto md:mx-0 group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                    <span className="font-mono text-xs font-bold">{step.number}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="bg-gray-50 dark:bg-gray-900/60 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white">
              What Creative Leaders Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id} 
                className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-sm relative flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                  <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">
                    {t.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="landing-faq" className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Got questions? We have answers. If you do not find what you are looking for, contact our queue handlers.
            </p>
          </div>

          <div className="space-y-4" id="faq-accordion">
            {FAQS.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-lg border border-gray-100 dark:border-gray-800/80 overflow-hidden bg-white dark:bg-gray-900 transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-display font-semibold text-gray-900 dark:text-white hover:text-brand-blue transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-950 text-white relative py-24 overflow-hidden border-t border-gray-900">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto leading-tight">
            Bulk Orders & Vector Conversion
          </h2>
          <p className="text-gray-400 text-base max-w-3xl mx-auto leading-relaxed">
            Have multiple artwork files that need vector conversion? Artclick offers professional bulk vector conversion services for logos, images, illustrations, and other artwork.
          </p>
          <p className="text-gray-400 text-base max-w-3xl mx-auto leading-relaxed">
            Simply send us your files and requirements. Our team will convert your artwork into clean, scalable, production-ready vector files with consistent quality across your entire order.
          </p>
          <div className="max-w-3xl mx-auto text-left rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h3 className="font-display font-bold text-xl text-white mb-4">Perfect for:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
              {[
                'Bulk logo & artwork conversion',
                'Print and embroidery businesses',
                'Agencies and designers',
                'Large artwork collections',
                'Branding and promotional projects'
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-300 text-base max-w-3xl mx-auto leading-relaxed">
            Have a bulk project? Send us your files today and get a customized quote from Artclick.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => goTo('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white hover:bg-brand-blue text-black hover:text-white font-semibold text-base transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2 group"
            >
              Get a Custom Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => goTo('submit-project')}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-base transition-colors cursor-pointer"
            >
              Submit Standard Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
