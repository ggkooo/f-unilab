import React from 'react';

interface BadgeProps {
  color: string;
  children: React.ReactNode;
  size?: 'default' | 'hero';
}

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  default: 'px-4 sm:px-5 py-2 sm:py-2.5 text-[clamp(0.95rem,1.3vw,1.8rem)] shadow-md',
  hero: 'px-6 sm:px-8 py-3 sm:py-4 text-[clamp(1.2rem,2.2vw,3.6rem)] shadow-xl',
};

const Badge: React.FC<BadgeProps> = ({ color, children, size = 'default' }) => (
  <span
    className={`inline-block rounded-full text-white font-extrabold tracking-wide ${sizeStyles[size]}`}
    style={{ background: color }}
  >
    {children}
  </span>
);

export default Badge;
