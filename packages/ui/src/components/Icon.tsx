import type { SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'play'
  | 'collection'
  | 'decks'
  | 'resonance'
  | 'settings'
  | 'sword'
  | 'heart'
  | 'shield'
  | 'close'
  | 'info'
  | 'rune'
  | 'skull'
  | 'impulse'
  | 'hidden'
  | 'curse'
  | 'silenced'
  | 'player'
  | 'bot'
  | 'sound'
  | 'log';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/**
 * Small original geometric SVG icon set (section 29: Iconography) - replaces emoji throughout
 * the premium UI. Deliberately minimal/line-based so it reads as one coherent family rather than
 * a grab-bag of platform emoji glyphs, which render differently per device/OS.
 */
export function Icon({ name, size = 18, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9h12v-9" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <path d="M5 4.5v15l14-7.5-14-7.5Z" strokeLinejoin="round" />
        </svg>
      );
    case 'collection':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="7" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="13" width="7" height="7" rx="1.2" />
        </svg>
      );
    case 'decks':
      return (
        <svg {...common}>
          <rect x="6" y="3" width="12" height="16" rx="1.5" transform="rotate(-6 12 11)" />
          <rect x="6" y="5" width="12" height="16" rx="1.5" />
        </svg>
      );
    case 'resonance':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="7.5" opacity="0.6" />
          <circle cx="12" cy="12" r="10.5" opacity="0.3" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.1 5.9l-1.7 1.7M7.6 16.4l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.6 5.9 5.9" />
        </svg>
      );
    case 'sword':
      return (
        <svg {...common}>
          <path d="M6 18 17 7l1.5 1.5L7.5 19.5z" />
          <path d="M15 5.5 18.5 9M4.5 19.5 6 18" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common} strokeWidth={1.6}>
          <path
            d="M12 20s-7-4.4-9.3-8.8C1.2 8 3 5 6.3 5c1.9 0 3.4 1 4.7 2.6C12.3 6 13.8 5 15.7 5 19 5 20.8 8 18.3 11.2 16 15.6 12 20 12 20Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6z" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6M12 7.5v.01" />
        </svg>
      );
    case 'rune':
      return (
        <svg {...common}>
          <path d="M7 4v16M7 4l10 8-10 8" />
        </svg>
      );
    case 'skull':
      return (
        <svg {...common}>
          <path d="M12 3c-4.4 0-7.5 3.3-7.5 7.3 0 2.7 1.4 4.6 3 5.9V19h2.5v-2h4v2H16v-2.8c1.6-1.3 3-3.2 3-5.9C19 6.3 16.4 3 12 3Z" />
          <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'impulse':
      return (
        <svg {...common} strokeLinejoin="miter">
          <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5z" />
        </svg>
      );
    case 'hidden':
      return (
        <svg {...common}>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2c.45-.08.92-.13 1.4-.13 5 0 8.5 4.4 9.5 6.9-.42 1.06-1.4 2.85-2.9 4.4M6.7 6.7C4.2 8.3 2.9 10.6 2.5 12c1 2.5 4.5 6.9 9.5 6.9 1.3 0 2.5-.3 3.6-.8" />
          <path d="M9.9 10.1a3 3 0 0 0 4 4" />
        </svg>
      );
    case 'curse':
      return (
        <svg {...common}>
          <path d="M8 3v4.5a4 4 0 0 0 8 0V3" />
          <path d="M8 21v-4.5a4 4 0 0 1 8 0V21" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'silenced':
      return (
        <svg {...common}>
          <path d="M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 5.3 1.9" />
          <path d="M6.5 11.5v.5a5.5 5.5 0 0 0 8.4 4.7M17.5 12v-.5" />
          <path d="M12 18v3M9 21h6" />
          <path d="M3 3l18 18" />
        </svg>
      );
    case 'player':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c.8-3.8 3.7-6 7-6s6.2 2.2 7 6" />
        </svg>
      );
    case 'bot':
      return (
        <svg {...common}>
          <rect x="5" y="9" width="14" height="10" rx="2.2" />
          <path d="M12 9V5.5" />
          <circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none" />
          <path d="M3.5 12.5v3M20.5 12.5v3" />
        </svg>
      );
    case 'sound':
      return (
        <svg {...common}>
          <path d="M4 10v4h3.5L13 18V6L7.5 10z" strokeLinejoin="round" />
          <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
        </svg>
      );
    case 'log':
      return (
        <svg {...common}>
          <path d="M6 3.5h9l4 4V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M8.5 10h7M8.5 13.5h7M8.5 17h4" />
        </svg>
      );
    default:
      return null;
  }
}
