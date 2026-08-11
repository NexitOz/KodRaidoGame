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
  | 'skull';

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
    default:
      return null;
  }
}
