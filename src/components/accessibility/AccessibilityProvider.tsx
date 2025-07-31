import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  focusVisible: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  focusVisible: true,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Detect user preferences on mount
  useEffect(() => {
    const detectPreferences = () => {
      const newSettings = { ...defaultSettings };

      // Detect reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        newSettings.reducedMotion = true;
      }

      // Detect high contrast preference
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        newSettings.highContrast = true;
      }

      // Detect screen reader usage
      if (navigator.userAgent.includes('NVDA') || 
          navigator.userAgent.includes('JAWS') || 
          navigator.userAgent.includes('VoiceOver')) {
        newSettings.screenReaderOptimized = true;
      }

      // Load saved preferences
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          Object.assign(newSettings, parsed);
        } catch (error) {
          console.warn('Failed to parse saved accessibility settings:', error);
        }
      }

      setSettings(newSettings);
    };

    detectPreferences();

    // Listen for preference changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
    ];

    const handleChange = () => detectPreferences();
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--motion-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--motion-duration');
      root.classList.remove('reduce-motion');
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${settings.fontSize}`);

    // Apply focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Apply screen reader optimizations
    if (settings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, announceToScreenReader }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Accessibility utility components
export const SkipLink: React.FC<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
  >
    {children}
  </a>
);

export const ScreenReaderOnly: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

export const VisuallyHidden: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
    {children}
  </span>
);

// Focus management hook
export const useFocusManagement = () => {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  const trapFocus = (containerSelector: string) => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { focusElement, trapFocus };
};

// Keyboard navigation hook
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          onEnter?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
        case 'ArrowUp':
          onArrowKeys?.('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
          onArrowKeys?.('down');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          onArrowKeys?.('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
          onArrowKeys?.('right');
          e.preventDefault();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape, onArrowKeys]);
};

export default AccessibilityProvider;
