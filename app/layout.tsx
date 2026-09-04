import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArtClick | Embroidery Digitizing & Vector Art Services',
  description:
    'ArtClick provides embroidery digitizing, vector art conversion, and graphic design for screen printers, embroiderers, and promotional product distributors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
