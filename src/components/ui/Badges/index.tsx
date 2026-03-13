import React from 'react';

interface BadgeProps {
  color: string;
  children: React.ReactNode;
  size?: 'default' | 'hero';
}

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  default: 'px-5 py-2.5 text-xl lg:text-2xl shadow-md',
  hero: 'px-8 py-4 text-3xl lg:text-5xl shadow-xl',
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
