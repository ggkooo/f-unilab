import React from 'react';
import { useLocation } from 'react-router-dom';
import unilabLogo from '../../../assets/logo-unilab.png';
import Clock from '../../ui/Clock';

const Header: React.FC = () => {
  const location = useLocation();
  const showClock = location.pathname === '/tv';

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 xl:py-5 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <img
          src={unilabLogo}
          alt="UNILAB Logo"
          className="w-[clamp(110px,8vw,260px)] object-contain"
        />
      </div>

      <div className="flex-1 flex justify-center">
        {showClock ? <Clock /> : null}
      </div>

      <div className="w-[clamp(110px,8vw,260px)]" />
    </header>
  );
};

export default Header;
