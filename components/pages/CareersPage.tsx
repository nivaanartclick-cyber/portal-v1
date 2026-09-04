'use client';

import React from 'react';

export default function CareersPage() {
  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-gray-950 py-24 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <span className="font-mono text-xs font-semibold tracking-widest text-brand-blue uppercase">
              CAREERS / OPEN ROLES
            </span>

            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-gray-900 dark:text-white">
              Graphic Designer – Job Opening
            </h1>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Position:</strong> Graphic Designer</p>
              <p><strong>Experience:</strong> Fresher or 1–2 Years</p>
              <p><strong>Job Type:</strong> Free Lancer/Parttime or Full-Time</p>
              <p><strong>Location:</strong> Remote (Should have laptop with required tools i.e. Adobe Illustrator and Photoshop)</p>

              <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-8">
                Job Description
              </h2>
              <p>
                ArtClick is looking for a creative and detail-oriented <strong>Graphic Designer</strong> with strong skills in <strong>Adobe Illustrator and Photoshop</strong>.
              </p>

              <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-8">
                Key Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and edit vector artwork, logos, and graphics.</li>
                <li>Convert raster images into clean, production-ready vector files.</li>
                <li>Prepare artwork for <strong>DTF, screen printing, sublimation, and promotional products</strong>.</li>
                <li>Perform background removal, image editing, and artwork cleanup.</li>
                <li>Make revisions based on client requirements.</li>
                <li>Ensure all artwork meets print and production specifications.</li>
                <li>Complete projects accurately and within deadlines.</li>
              </ul>

              <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-8">
                Required Skills
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fresher or 1- 2 years of relevant graphic design experience.</li>
                <li>Excellent knowledge of <strong>Adobe Illustrator &amp; Photoshop</strong>.</li>
                <li>Strong understanding of vector tracing/redrawing.</li>
                <li>Knowledge of <strong>CMYK, RGB, Pantone, DPI, and print-ready files</strong>.</li>
                <li>Good attention to detail and ability to meet deadlines.</li>
                <li>Good communication and teamwork skills.</li>
              </ul>

              <p className="mt-6">
                <strong>Preferred:</strong> Experience in Adobe Illustrator and Photoshop, promotional products, DTF, screen printing, sublimation, or embroidery artwork.
              </p>

              <p className="mt-6">
                <strong>To Apply:</strong> Send your <strong>Resume + Portfolio/Sample Work if any.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
