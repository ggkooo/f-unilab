import React from 'react';
import unilabLogo from '../../../assets/logo-unilab.png';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 px-8 lg:px-10 py-6 lg:py-2 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4 lg:gap-6">
        <img
          src={unilabLogo}
          alt="UNILAB Logo"
          className="w-[120px] object-contain"
        />
      </div>
    </header>
  );
};

export default Header;
