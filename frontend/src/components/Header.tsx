import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ApplicationRoutes } from '../utils/constants';
import InternetIdentity from '.././InternetIdentity';

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { href: ApplicationRoutes.Marketplace, label: 'Marketplace' },
    { href: ApplicationRoutes.Services, label: 'Service providers' },
    { href: ApplicationRoutes.Profile, label: 'Profile' },
    { href: ApplicationRoutes.TyreCreateForm, label: 'Register tyre' },
  ];

  const isActiveLink = (href: string) => location.pathname === href;

  const NavLinkComponent = ({
    href,
    label,
    mobile = false,
  }: {
    href: string;
    label: string;
    mobile?: boolean;
  }) => {
    const isActive = isActiveLink(href);
    const baseClasses = mobile
      ? 'block px-3 py-2 text-base font-medium transition-colors duration-300'
      : 'text-lg mx-4 transition-all duration-300 relative';

    const activeClasses = mobile
      ? 'text-green-400 bg-gray-900'
      : 'font-bold text-green-400 after:bottom-0 after:left-0 after:bg-green-400 after:h-[2px] after:absolute after:w-full';

    const inactiveClasses = mobile
      ? 'text-white hover:text-green-400 hover:bg-gray-800'
      : 'text-white after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300';

    return (
      <Link
        to={href}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-black'>
      <div className='container flex h-16 items-center justify-between py-4 px-4 sm:px-6 lg:px-10 mx-auto'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <Link
            to={ApplicationRoutes.HomePage}
            className='text-xl font-bold text-green-400 inline-flex items-center gap-3'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-white sm:w-10 sm:h-10'
            >
              <circle cx='12' cy='12' r='10' />
              <circle cx='12' cy='12' r='4' />
              <line x1='12' y1='2' x2='12' y2='4' />
              <line x1='12' y1='20' x2='12' y2='22' />
              <line x1='4.93' y1='4.93' x2='6.34' y2='6.34' />
              <line x1='17.66' y1='17.66' x2='19.07' y2='19.07' />
              <line x1='2' y1='12' x2='4' y2='12' />
              <line x1='20' y1='12' x2='22' y2='12' />
              <line x1='4.93' y1='19.07' x2='6.34' y2='17.66' />
              <line x1='17.66' y1='6.34' x2='19.07' y2='4.93' />
            </svg>
            <div className='hidden sm:block'>Happy wheel</div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center gap-6 overflow-hidden'>
          {navigationItems.map(item => (
            <NavLinkComponent key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Right side - Auth + Mobile Menu Button */}
        <div className='flex items-center gap-4'>
          {/* Desktop Auth */}
          <div className='hidden sm:block'>
            <InternetIdentity />
          </div>

          {/* Mobile Menu Button */}
          <button
            className='lg:hidden p-2 text-white hover:text-green-400 transition-colors'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='lg:hidden border-t border-gray-800'>
          <div className='px-2 pt-2 pb-3 space-y-1 bg-black'>
            {navigationItems.map(item => (
              <NavLinkComponent key={item.href} href={item.href} label={item.label} mobile={true} />
            ))}

            {/* Mobile Auth */}
            <div className='px-3 py-2 border-t border-gray-800 mt-4 pt-4'>
              <InternetIdentity />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
