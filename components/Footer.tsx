'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail, Phone, MapPin, ArrowUpRight, MessageCircle,
  Instagram, Facebook, Linkedin, Twitter, Youtube, Link as LinkIcon,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useAppRouter } from '@/lib/navigation';
import { getSettings, SettingsResponse } from '@/lib/api';
import { SocialLinks } from '@/types/settings';

const SOCIAL_CONFIG: { key: keyof SocialLinks; icon: React.ElementType; label: string }[] = [
  { key: 'instagram', icon: Instagram, label: 'Instagram' },
  { key: 'facebook', icon: Facebook, label: 'Facebook' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'twitter', icon: Twitter, label: 'Twitter / X' },
  { key: 'youtube', icon: Youtube, label: 'YouTube' },
  { key: 'tiktok', icon: LinkIcon, label: 'TikTok' },
];

export default function Footer() {
  const { goTo, goToServiceAnchor } = useAppRouter();
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SettingsResponse | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const servicesLinks = [
    { label: 'Vector Conversion', id: 'vector-conversion' },
    { label: 'Clipping Path', id: 'clipping-path' },
    { label: 'Background Removal', id: 'background-removal' },
    { label: 'Photo Retouching', id: 'photo-retouching' },
    { label: 'Professional Embroidery Digitizing', id: 'digitizing-services' },
  ];

  const activeSocials = SOCIAL_CONFIG.filter(
    (s) => settings?.socialLinks?.[s.key]?.trim()
  );

  return (
    <footer id="app-footer" className="relative bg-ink text-gray-400 pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <BrandLogo height={48} variant="light" onClick={() => goTo('home')} />
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Embroidery digitizing, vector art conversion, graphic design, and business support for screen printers, embroiderers, and promotional product distributors worldwide.
            </p>
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {activeSocials.map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={settings!.socialLinks[key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-accent hover:bg-brand-accent/10 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white tracking-wider uppercase text-xs">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {servicesLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => goToServiceAnchor(link.id)}
                    className="hover:text-brand-accent transition-colors cursor-pointer text-left flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => goTo('services')} className="text-brand-accent hover:text-brand-secondary font-medium transition-colors cursor-pointer text-left">
                  Explore All Services →
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white tracking-wider uppercase text-xs">Agency Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => goTo('home')} className="hover:text-white transition-colors cursor-pointer text-left">Home Landing</button></li>
              <li><button onClick={() => goTo('portfolio')} className="hover:text-white transition-colors cursor-pointer text-left">Portfolio Samples</button></li>
              <li><button onClick={() => goTo('about')} className="hover:text-white transition-colors cursor-pointer text-left">About Our Crew</button></li>
              <li><button onClick={() => goTo('contact')} className="hover:text-white transition-colors cursor-pointer text-left">Contact & Support</button></li>
              <li><button onClick={() => goTo('careers')} className="hover:text-white transition-colors cursor-pointer text-left">Careers / Open Roles</button></li>
              <li><button onClick={() => goTo('submit-project')} className="hover:text-white transition-colors cursor-pointer text-left font-medium text-brand-accent">Submit Project Form</button></li>
              <li><button onClick={() => goTo('request-revision')} className="hover:text-white transition-colors cursor-pointer text-left font-medium text-brand-secondary">Request Revision</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white tracking-wider uppercase text-xs">Contact Info</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-1" />
                <span>{settings?.businessAddress || 'ArtClick, Nr Infinity Park, Vasna Bhayli Road, Vadodara, Gujarat'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-accent shrink-0" />
                <a href={`tel:${(settings?.businessPhone || '+916355757852').replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                  {'+91 635 575 7852'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                <div className="flex flex-col gap-1">
                 
                  <a href="mailto:nivaan.artclick@gmail.com" className="hover:text-white transition-colors">
                    nivaan.artclick@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-brand-accent shrink-0" />
                <a href="https://wa.me/916355757852" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: +91 635 575 7852
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} {settings?.businessName || 'ArtClick'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
