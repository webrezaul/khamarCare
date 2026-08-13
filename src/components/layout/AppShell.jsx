// KhamarCare — App Shell with Bottom Navigation
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Beef, Milk, Wheat, Wallet, Menu } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav.dashboard' },
  { path: '/cattle', icon: Beef, labelKey: 'nav.cattle' },
  { path: '/milk', icon: Milk, labelKey: 'nav.milk' },
  { path: '/feed', icon: Wheat, labelKey: 'nav.feed' },
  { path: '/finance', icon: Wallet, labelKey: 'nav.finance' },
];

export default function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();

  // Hide bottom nav on form pages
  const hideNav = ['/cattle/add', '/milk/add', '/feed/add', '/finance/income/add', '/finance/expense/add'].includes(location.pathname);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      {!hideNav && (
        <nav className="bottom-nav safe-area-bottom">
          {navItems.map(({ path, icon: Icon, labelKey }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} strokeWidth={2} />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
          <NavLink
            to="/more"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Menu size={22} strokeWidth={2} />
            <span>{t('nav.more')}</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}
