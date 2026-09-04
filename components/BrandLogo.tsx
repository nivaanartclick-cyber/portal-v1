'use client';

import Image from 'next/image';
import { useAppRouter } from '@/lib/navigation';

type BrandLogoProps = {
  variant?: 'light' | 'dark';
  className?: string;
  height?: number;
  onClick?: () => void;
  clickable?: boolean;
};

export default function BrandLogo({
  variant = 'dark',
  className = '',
  height = 40,
  onClick,
  clickable = true,
}: BrandLogoProps) {
  const { goTo } = useAppRouter();
  const width = Math.round(height * 3.2);

  const handleClick = () => {
    if (onClick) onClick();
    else if (clickable) goTo('home');
  };

  return (
    <button
      type="button"
      onClick={clickable || onClick ? handleClick : undefined}
      className={`inline-flex items-center shrink-0 ${clickable || onClick ? 'cursor-pointer' : 'cursor-default'} ${className}`}
      aria-label="ArtClick home"
    >
      <Image
        src="/brand/artclick-logo.png"
        alt="ArtClick"
        width={width}
        height={height}
        priority
        className={`h-auto w-auto object-contain ${variant === 'light' ? 'brightness-110' : ''}`}
        style={{ maxHeight: height }}
      />
    </button>
  );
}
