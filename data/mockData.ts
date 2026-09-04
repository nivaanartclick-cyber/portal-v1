/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceDetail, Testimonial, FAQItem, Project } from '@/types';

export const SERVICES: ServiceDetail[] = [
  {
    id: 'vector-conversion',
    title: 'Vector Art Conversion',
    tagline: 'Clean, Scalable, Production-Ready.',
    description: 'Professional vector art conversion for logos, artwork, illustrations, and print assets. We convert raster images, low-resolution logos, and sketches into crisp vector files that are ready for production.',
    features: [
      'Logo re-creation and manual vector tracing',
      'Image-to-vector conversion (JPG, PNG, scans)',
      'Spot-color and full-color separations for screen printing',
      'Output formats: AI, EPS, PDF, and SVG'
    ],
    turnaround: '24 - 48 Hours',
    imagePlaceholder: 'vector'
  },
  {
    id: 'clipping-path',
    title: 'Clipping Path',
    tagline: 'Hand-Drawn Bezier Pen Masks.',
    description: 'Get razor-sharp borders and absolute separation using industry-standard manual Photoshop Pen tool clipping paths. Ideal for catalog printing, high-end e-commerce product listings, and advertising layouts.',
    features: [
      'Multi-clipping paths for separate product editing',
      'Perfect edge smoothing without pixelations or blur',
      'Active path storage inside TIFF, JPEG, or PSD structures',
      'Clean cutouts of any product, model, or machinery'
    ],
    turnaround: '12 - 24 Hours',
    imagePlaceholder: 'clipping'
  },
  {
    id: 'background-removal',
    title: 'Background Removal',
    tagline: 'Isolate Your Products Instantly.',
    description: 'Isolate items from busy or standard white backdrops. We replace, clean, or export products with complete transparency, enabling seamless integrations into catalogs, web applications, or composite layouts.',
    features: [
      'Transparent PNG or custom solid background replacement',
      'Web-optimized resolution sizing and compression scaling',
      'Consistent margins, sizing, and vertical alignments across catalogs',
      'Bulk processing for large-scale inventory uploads'
    ],
    turnaround: '12 - 24 Hours',
    imagePlaceholder: 'background'
  },
  {
    id: 'image-masking',
    title: 'Image Masking',
    tagline: 'Surgical Precision for Fine Hair & Soft Edges.',
    description: 'Perfect for complex subjects like human hair, fur, transparent glass, or fine mesh that cannot be cleanly separated using standard clipping paths. We utilize advanced channel and color range masking.',
    features: [
      'Soft-edge hair and fur preservation masking',
      'Transparency masking for bottles, glassware, and plastics',
      'Color channel extraction for complex tree/foliage borders',
      'Extremely detailed layers for beauty and fashion images'
    ],
    turnaround: '24 Hours',
    imagePlaceholder: 'masking'
  },
  {
    id: 'photo-retouching',
    title: 'Photo Retouching',
    tagline: 'High-End Beauty, Skin & Product Cosmetics.',
    description: 'Premium restoration, skin cleaning, color corrections, and structural enhancement. From high-fashion editorial portraits to polished e-commerce product photos, we bring out the absolute best in every pixel.',
    features: [
      'Frequency separation skin retouching (retains natural pores)',
      'Blemish and dust removal, glare adjustments, reflection control',
      'Digital makeup, hair cleanup, teeth whitening, eye brightness',
      'Color temperature matching, contrast tuning, and tone styling'
    ],
    turnaround: '24 - 48 Hours',
    imagePlaceholder: 'retouching'
  },
  {
    id: 'shadow-creation',
    title: 'Shadow Creation',
    tagline: 'Add Depth & Realistic Dimension.',
    description: 'Incorporate realistic shadows beneath isolated product shots to add weight, visual ground, and premium depth. We construct soft, natural drop, reflection, or custom-angle studio light shadows.',
    features: [
      'Natural drop shadows utilizing existing light vectors',
      'Polished table-top mirror reflection shadows',
      'Realistic ambient shadows for grounding isolated items',
      'Controllable feather, opacity, and blur parameters'
    ],
    turnaround: '12 - 24 Hours',
    imagePlaceholder: 'shadow'
  },
  {
    id: 'ghost-mannequin',
    title: 'Ghost Mannequin',
    tagline: 'Invisible 3D Apparel Editing.',
    description: 'Also known as hollow man, we merge multiple apparel shots (inside-out collars, cuffs, and front views) to create a premium, hollow 3D visual. This displays the full shape, fit, and inner details of clothing.',
    features: [
      'Collar and inner neck joint merging from separate shots',
      'Symmetric shaping, wrinkle smoothing, and fabric straightening',
      'Ghost effect for coats, jeans, dresses, caps, and blazers',
      'Natural depth shading inside the garment cavity'
    ],
    turnaround: '12 - 24 Hours',
    imagePlaceholder: 'ghost'
  },
  {
    id: 'color-change',
    title: 'Color Change',
    tagline: 'Multi-Color Variations Without Reshooting.',
    description: 'Digitally convert product colors to represent any SKU or swatch. Send us one base photograph, and we will accurately render a matching color catalog representing your entire color lineup.',
    features: [
      'Exact Pantone, RGB, or Hex matching',
      'Texture and shading retention across changed colors',
      'Gold, chrome, metallic, and matte conversion options',
      'Ideal for apparel, electronics, cosmetics, and furniture catalogs'
    ],
    turnaround: '12 - 24 Hours',
    imagePlaceholder: 'color'
  },
  {
    id: 'image-manipulation',
    title: 'Graphic Designing',
    tagline: 'Print-Ready Art for Promo Products.',
    description: 'Graphic design services built specifically for screen printers and promotional product distributors — logo re-creation, art re-draws, mock-ups, and print-ready artwork formatted for your exact imprint method.',
    features: [
      'Logo re-creation and art re-draws for low-quality files',
      'Mock-ups and virtual samples for customer approval',
      'Custom illustration and brand style guides',
      'Formatted for screen print, DTG, sublimation, and laser engraving'
    ],
    turnaround: '24 - 48 Hours',
    imagePlaceholder: 'manipulation'
  },
  {
    id: 'digitizing-services',
    title: 'Professional Embroidery Digitizing',
    tagline: 'High-Quality Embroidery-Ready Files.',
    description: 'Turn your artwork into high-quality embroidery-ready files with Artclick’s professional embroidery digitizing service. We convert logos, designs, and images into precise embroidery files with clean stitching, accurate details, and excellent thread coverage.',
    features: [
      'Logo & artwork digitizing',
      'Custom embroidery digitizing',
      'Cap, shirt & jacket designs',
      '3D puff embroidery',
      'Applique digitizing',
      'Bulk embroidery digitizing'
    ],
    turnaround: '24 - 48 Hours',
    imagePlaceholder: 'digitizing'
  },
  {
    id: 'staffing-support',
    title: 'Staffing Support',
    tagline: 'Extra Production Capacity, On Demand.',
    description: 'Flexible staffing support for creative and production teams that need reliable help during peak order volumes, catalog refreshes, and deadline-heavy periods.',
    features: [
      'Overflow support for production queues',
      'Dedicated remote operators for repeat workflows',
      'Short-term and ongoing support models',
      'Aligned with your existing design and approval process'
    ],
    turnaround: 'Custom SLA',
    imagePlaceholder: 'staffing'
  },
  {
    id: 'virtual-assistants',
    title: 'Virtual Assistants',
    tagline: 'Reliable Back-Office Support.',
    description: 'Virtual assistant support for admin, coordination, research, and workflow follow-up so your internal team can stay focused on design, sales, and delivery.',
    features: [
      'Inbox and follow-up coordination',
      'Order tracking and customer updates',
      'Research and data-entry support',
      'Flexible support matched to your process'
    ],
    turnaround: 'Custom SLA',
    imagePlaceholder: 'assistant'
  },
  {
    id: 'admin-support',
    title: 'Admin Support',
    tagline: 'Structured Support for Daily Operations.',
    description: 'Admin support services that help organize repetitive operational work, maintain turnaround visibility, and keep client communication moving without hiring a full in-house team.',
    features: [
      'Production tracking and status coordination',
      'File organization and intake support',
      'Customer communication assistance',
      'Repeatable admin workflows for growing teams'
    ],
    turnaround: 'Custom SLA',
    imagePlaceholder: 'admin'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Dave Helton',
    role: '',
    company: '',
    content: "I have been very pleased so far. You all have been able to tackle everything that I've sent to you, and usually I have my art back in just a couple days. I think only once or twice it took longer, but that was for some complex art, so I understand. All in all very happy and look forward to doing business together.\n\nThanks,\n\nDave Helton",
    avatar: '',
    rating: 5
  },
  {
    id: 't2',
    name: 'Cephas',
    role: '',
    company: '',
    content: 'you guys run a good program',
    avatar: '',
    rating: 5
  },
  {
    id: 't3',
    name: 'Jae Moon',
    role: '',
    company: '',
    content: "ArtClick did an excellent job with our vector artwork. The final file was clean, precise, and professionally prepared, with all the details converted accurately. The vector program made the artwork easy to work with and ready for our printing and production needs. The quality was impressive, the turnaround was quick, and communication was smooth throughout the process.\n\nWe're very happy with the result and will definitely use ArtClick again for future vector work.",
    avatar: '',
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'What is embroidery digitizing?',
    answer: 'Embroidery digitizing is the process of converting artwork, logos, or images into a stitch file that embroidery machines can read — specifying stitch type, direction, and density for accurate, production-ready results.'
  },
  {
    id: 'f2',
    question: 'What file formats do you provide?',
    answer: 'For embroidery: DST, PES, EMB, EXP, JEF, VP3, and other major machine formats. For vector art: AI, EPS, PDF, and SVG. Let us know your machine or software and we will deliver the format you need.'
  },
  {
    id: 'f3',
    question: 'How long does turnaround take?',
    answer: 'Most vector art and embroidery digitizing orders are completed within 24–48 hours. Rush turnaround is available on request.'
  },
  {
    id: 'f4',
    question: 'Do you offer free revisions?',
    answer: 'Yes. We revise digitized files and vector artwork at no extra cost until you are satisfied with the result.'
  },
  {
    id: 'f5',
    question: 'Do you work with clients outside India?',
    answer: 'Yes. ArtClick serves screen printers, embroiderers, and promotional product distributors globally, including the US, UK, Canada, and Australia.'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'HAS-8104',
    clientName: 'Sarah Jenkins',
    companyName: 'Scribe Apparel Co.',
    email: 'sarah@scribeapparel.com',
    phone: '+1 (555) 392-1049',
    serviceRequired: 'Ghost Mannequin',
    projectDescription: 'Merge neck joins and sleeves for 18 items of our Summer linen shirt lineup. Clean wrinkles.',
    deadline: '2026-06-30',
    budget: '$360',
    uploadedFile: 'summer_linen_package.zip',
    googleDriveLink: 'https://drive.google.com/drive/folders/1aBcD_ScribeApparelSummer',
    additionalNotes: 'Please maintain standard shadows below the collar. Uniform sizing.',
    status: 'In Progress',
    priority: 'High',
    submissionDate: '2026-06-27T10:14:00Z',
    notes: 'Assigning to lead clothing retoucher. Files downloaded and verified.',
    timeline: [
      { status: 'Todo', updatedAt: '2026-06-27T10:14:00Z', updatedBy: 'System', comment: 'Client submitted intake form' },
      { status: 'Review', updatedAt: '2026-06-27T11:30:00Z', updatedBy: 'Admin', comment: 'Details verified, files checked' },
      { status: 'In Progress', updatedAt: '2026-06-27T12:00:00Z', updatedBy: 'Admin', comment: 'Production started' }
    ]
  },
  {
    id: 'HAS-8105',
    clientName: 'Marcus Thorne',
    companyName: 'PrimeMerch Global',
    email: 'marcus@primemerch.com',
    phone: '+1 (555) 482-1920',
    serviceRequired: 'Digitizing Services',
    projectDescription: 'Logo vector-to-stitch digitization for left chest caps and heavy hoodies. Needs DST and PES formats.',
    deadline: '2026-07-02',
    budget: '$120',
    uploadedFile: 'primemerch_logo_vector.eps',
    googleDriveLink: '',
    additionalNotes: 'Need a test sew report if possible. Stitch count should be around 8k.',
    status: 'Review',
    priority: 'Medium',
    submissionDate: '2026-06-28T04:20:00Z',
    notes: 'Checked SVG. Needs tight underlays for polyester caps. Will begin soon.',
    timeline: [
      { status: 'Todo', updatedAt: '2026-06-28T04:20:00Z', updatedBy: 'System', comment: 'Client submitted intake form' },
      { status: 'Review', updatedAt: '2026-06-28T05:00:00Z', updatedBy: 'Admin', comment: 'Awaiting stitch artist queue allocation' }
    ]
  },
  {
    id: 'HAS-8106',
    clientName: 'Elena Rostova',
    companyName: 'Aura Cosmetics',
    email: 'elena@auracosmetics.co',
    phone: '+33 6 1234 5678',
    serviceRequired: 'Photo Retouching',
    projectDescription: 'Surgical makeup blending and high-end skin retouching on 5 promotional headshots.',
    deadline: '2026-07-05',
    budget: '$500',
    uploadedFile: 'skin_headshots_raw.zip',
    googleDriveLink: 'https://drive.google.com/drive/folders/1xYz_AuraBeautyRaw',
    additionalNotes: 'Keep the original skin pore texture. Frequency separation technique required.',
    status: 'Todo',
    priority: 'Urgent',
    submissionDate: '2026-06-28T05:30:00Z',
    notes: '',
    timeline: [
      { status: 'Todo', updatedAt: '2026-06-28T05:30:00Z', updatedBy: 'System', comment: 'Client submitted intake form' }
    ]
  },
  {
    id: 'HAS-8101',
    clientName: 'David Kim',
    companyName: 'Velo Sports Gear',
    email: 'david@velosports.com',
    phone: '+1 (555) 902-3940',
    serviceRequired: 'Background Removal',
    projectDescription: 'Batch removal of background for 120 sports helmet catalog pictures. Render onto transparent PNG.',
    deadline: '2026-06-26',
    budget: '$150',
    uploadedFile: 'velo_helmets_raw.zip',
    googleDriveLink: '',
    additionalNotes: 'Deliver 1500x1500px square format. Web-optimized.',
    status: 'Delivered',
    priority: 'Low',
    submissionDate: '2026-06-24T08:15:00Z',
    notes: 'Completed beautifully. Deliverable downloaded by client.',
    timeline: [
      { status: 'Todo', updatedAt: '2026-06-24T08:15:00Z', updatedBy: 'System', comment: 'Form submission' },
      { status: 'Review', updatedAt: '2026-06-24T09:00:00Z', updatedBy: 'Admin' },
      { status: 'In Progress', updatedAt: '2026-06-24T09:30:00Z', updatedBy: 'Admin' },
      { status: 'Completed', updatedAt: '2026-06-25T15:00:00Z', updatedBy: 'Admin', comment: 'File package assembled' },
      { status: 'Delivered', updatedAt: '2026-06-25T16:20:00Z', updatedBy: 'Admin', comment: 'Download links dispatched' }
    ]
  },
  {
    id: 'HAS-8102',
    clientName: 'Thomas Vance',
    companyName: 'Vance Signs',
    email: 'tommy@vancesigns.biz',
    phone: '+1 (555) 782-9904',
    serviceRequired: 'Vector Conversion',
    projectDescription: 'Reconstruct a heavily pixelated vintage logo from a 200px scan into infinite vector AI format.',
    deadline: '2026-06-27',
    budget: '$75',
    uploadedFile: 'pixelated_vintage_logo.jpg',
    googleDriveLink: '',
    additionalNotes: 'Need exact match for the historical typography if possible, or trace letters.',
    status: 'Completed',
    priority: 'Medium',
    submissionDate: '2026-06-25T14:40:00Z',
    notes: 'Hand-traced matching letters perfectly using Bezier curves.',
    timeline: [
      { status: 'Todo', updatedAt: '2026-06-25T14:40:00Z', updatedBy: 'System' },
      { status: 'Review', updatedAt: '2026-06-25T15:30:00Z', updatedBy: 'Admin' },
      { status: 'In Progress', updatedAt: '2026-06-25T16:00:00Z', updatedBy: 'Admin' },
      { status: 'Completed', updatedAt: '2026-06-26T18:00:00Z', updatedBy: 'Admin', comment: 'Completed tracing. Exported AI and SVG.' }
    ]
  },
  {
    id: 'HAS-8103',
    clientName: 'Clara Oswald',
    companyName: 'Tardis Collectibles',
    email: 'clara@tardiscollectibles.org',
    phone: '+44 7700 900077',
    serviceRequired: 'Clipping Path',
    projectDescription: 'Create clipping paths for 45 porcelain antique figures. Backgrounds should be pure white.',
    deadline: '2026-06-29',
    budget: '$225',
    uploadedFile: 'tardis_porcelain_pack.rar',
    googleDriveLink: 'https://drive.google.com/drive/folders/1_TardisPorcelain45',
    additionalNotes: 'Slight feather on reflections is required to look natural.',
    status: 'Todo',
    priority: 'Medium',
    submissionDate: '2026-06-26T22:12:00Z',
    notes: 'Will download folders and start production queue tomorrow morning.',
    timeline: [
      { status: 'Todo', updatedAt: '2026-06-26T22:12:00Z', updatedBy: 'System' }
    ]
  }
];
