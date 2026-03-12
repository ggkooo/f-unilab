import React from 'react';

interface BadgeProps {
  color: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color, children }) => (
  <span
    className={`inline-block px-4 py-2 rounded-full text-white font-bold text-lg lg:text-2xl shadow-md`}
    style={{ background: color }}
  >
    {children}
  </span>
);

export default Badge;
