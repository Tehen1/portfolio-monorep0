/**
 * @fileoverview Composant Navigation Mobile type-safe pour FixieRun
 * @description Navigation avec validation TypeScript stricte et accessibility
 * @author FixieRun Development Team
 * @version 1.0.0
 * @license MIT
 */

'use client';

import React, { useCallback, useMemo } from 'react';

import type {
  ActiveTab,
  TabConfig,
  Notification,
  NFTMetadata,
  EquippedNFT,
  UserProfile,
  EventHandlers
} from '@/lib/types';

import {
  MOBILE_TABS,
  isTabConfig,
  isActiveTab
} from '@/lib/types';

import {
  useActiveTab,
  useNotifications,
  useNFTEquipment,
  useGeoTracking
} from '@/lib/hooks';

/**
 * Props du composant MobileNavigation
 */
interface MobileNavigationProps {
  readonly activeTab: ActiveTab;
  readonly onTabChange: (tab: ActiveTab) => void;
  readonly notificationCount?: number;
  readonly isLoading?: boolean;
  readonly disabled?: boolean;
}

/**
 * Composant NavigationTab - Onglet individuel
 */
const NavigationTab: React.FC<{
  readonly tab: TabConfig;
  readonly isActive: boolean;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}> = ({ tab, isActive, onClick, disabled = false }) => {
  // Validation runtime du tab
  if (!isTabConfig(tab)) {
    console.error('Invalid TabConfig:', tab);
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={tab.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex-1 py-3 px-2 transition-all duration-200
        flex flex-col items-center justify-center gap-1
        ${
          isActive
            ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600'
            : 'text-gray-600 hover:bg-gray-50 border-t-2 border-transparent'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
      `}
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        {tab.icon}
      </span>
      <span className="text-xs font-medium truncate">{tab.name}</span>
    </button>
  );
};

/**
 * Composant MobileNavigation - Barre de navigation mobile
 * ✅ Type-safe avec validation exhaustive
 * ✅ Accessibility complète (ARIA labels, keyboard navigation)
 * ✅ Performance optimisée (useMemo, useCallback)
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
  notificationCount = 0,
  isLoading = false,
  disabled = false
}) => {
  // Validation de l'onglet actif
  if (!isActiveTab(activeTab)) {
    console.error(`Invalid activeTab: ${activeTab}`);
    return null;
  }

  // Callback optimisé avec useCallback
  const handleTabClick = useCallback(
    (tabId: unknown) => {
      if (isActiveTab(tabId)) {
        onTabChange(tabId);
      } else {
        console.warn(`Invalid tab clicked: ${tabId}`);
      }
    },
    [onTabChange]
  );

  // Mémoriser les tabs
  const validTabs = useMemo(() => {
    return MOBILE_TABS.filter((tab) => isTabConfig(tab));
  }, []);

  // Gestion keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      let nextIndex = index;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (index - 1 + validTabs.length) % validTabs.length;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (index + 1) % validTabs.length;
          break;
        default:
          return;
      }

      const nextTab = validTabs[nextIndex];
      if (nextTab && isTabConfig(nextTab)) {
        handleTabClick(nextTab.id);
      }
    },
    [validTabs, handleTabClick]
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div
        className="flex gap-0"
        role="tablist"
        onKeyDown={(e) => {
          const currentIndex = validTabs.findIndex((tab) => tab.id === activeTab);
          if (currentIndex >= 0) {
            handleKeyDown(e, currentIndex);
          }
        }}
      >
        {validTabs.map((tab, index) => (
          <div
            key={tab.id}
            role="presentation"
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <NavigationTab
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={disabled || isLoading}
            />

            {/* Badge notification pour l'onglet 'profile' */}
            {tab.id === 'profile' && notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {notificationCount > 99 ? '99+' : notificationCount}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-pulse" />
      )}
    </nav>
  );
};

/**
 * Props du composant MobileLayout
 */
interface MobileLayoutProps {
  readonly activeTab: ActiveTab;
  readonly onTabChange: (tab: ActiveTab) => void;
  readonly children: React.ReactNode;
  readonly isLoading?: boolean;
  readonly notifications?: Notification[];
  readonly nfts?: NFTMetadata[];
  readonly userProfile?: UserProfile | null;
}

/**
 * Composant MobileLayout - Layout complet avec navigation
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
  isLoading = false,
  notifications = [],
  nfts = [],
  userProfile
}) => {
  // Compter les notifications non lues
  const unreadCount = notifications.length;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Contenu principal - avec padding pour la nav mobile */}
      <main className="flex-1 overflow-y-auto pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Chargement...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Navigation mobile */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        notificationCount={unreadCount}
        isLoading={isLoading}
      />
    </div>
  );
};

/**
 * Props du composant TabContent
 */
interface TabContentProps {
  readonly tab: ActiveTab;
  readonly isActive: boolean;
  readonly children: React.ReactNode;
}

/**
 * Composant TabContent - Conteneur pour les contenus d'onglet
 */
export const TabContent: React.FC<TabContentProps> = ({
  tab,
  isActive,
  children
}) => {
  return (
    <div
      role="tabpanel"
      id={`panel-${tab}`}
      hidden={!isActive}
      className={isActive ? 'block' : 'hidden'}
    >
      {children}
    </div>
  );
};

/**
 * Export namespace pour l'utilisation facile
 */
export const Mobile = {
  Navigation: MobileNavigation,
  Layout: MobileLayout,
  TabContent,
  Tab: NavigationTab
};
